import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, Stack, Select, MenuItem,
  FormControl, Button, Divider, Alert, IconButton, Tooltip
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SUPPLIERS, PO_LINES, PRICE_BOOKS, PRODUCTS } from '../data/mockData';

const FI_ORANGE = '#F57C00';
const FI_PURPLE = '#674EA7';


function cheapest(code: string): string {
  let bestId = 'sup2'; let bestPrice = 9999;
  for (const s of SUPPLIERS) {
    const p = PRICE_BOOKS[s.id]?.[code];
    if (p !== undefined && p < bestPrice) { bestPrice = p; bestId = s.id; }
  }
  return bestId;
}

export const POPage: React.FC = () => {
  const [lines, setLines] = useState(PO_LINES.map(l => ({ ...l })));
  const [poSupplier, setPoSupplier] = useState('sup2');
  const [optimised, setOptimised] = useState(false);

  const updateLine = (id: number, supplierId: string) =>
    setLines(ls => ls.map(l => l.id === id ? { ...l, supplierId } : l));

  const switchAll = (supplierId: string) => {
    setPoSupplier(supplierId);
    setLines(ls => ls.map(l => ({ ...l, supplierId })));
  };

  const optimise = () => {
    setLines(ls => ls.map(l => ({ ...l, supplierId: cheapest(l.inventoryCode) })));
    setOptimised(true);
    setTimeout(() => setOptimised(false), 4000);
  };

  const total = lines.reduce((s, l) => {
    const price = PRICE_BOOKS[l.supplierId]?.[l.inventoryCode] ?? PRODUCTS.find(p => p.code === l.inventoryCode)?.purchasePrice ?? 0;
    return s + price * l.qty;
  }, 0);
  const totalGst = total * 0.1;

  return (
    <Box>
      {optimised && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setOptimised(false)}>
          Lines optimised to cheapest available supplier per item. Review below.
        </Alert>
      )}

      {/* PO Header */}
      <Paper sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          <Typography variant="h6" fontWeight={800} sx={{ color: FI_ORANGE }}>PO-4571</Typography>
          <Chip label="Draft" sx={{ backgroundColor: '#fff3e0', color: FI_ORANGE, fontWeight: 700 }} />
          <Box flex={1} />
          <Typography variant="caption" color="text.secondary">Created by Daniel Cant, 18 Mar 2026 08:29 AM</Typography>
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" display="block">Supplier</Typography>
            <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
              <Select value={poSupplier} onChange={e => switchAll(e.target.value)}>
                {SUPPLIERS.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
            {SUPPLIERS.find(s => s.id === poSupplier) && (
              <Box mt={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {SUPPLIERS.find(s => s.id === poSupplier)?.terms} &nbsp;·&nbsp;
                  {SUPPLIERS.find(s => s.id === poSupplier)?.email}
                </Typography>
              </Box>
            )}
          </Box>
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" display="block">Site</Typography>
            <Typography variant="body2" fontWeight={600} mt={0.5}>Factory Pools, Joel</Typography>
            <Typography variant="caption" color="text.secondary">4 Harvest Rd, Yandina QLD 4561</Typography>
          </Box>
          <Box flex={1}>
            <Stack direction="row" spacing={2}>
              {[['Title', '071yyk factory pools'], ['Invoice term', '30 Days EOM'], ['PO Date', '18/03/2026']].map(([l, v]) => (
                <Box key={l}>
                  <Typography variant="caption" color="text.secondary" display="block">{l}</Typography>
                  <Typography variant="body2" fontWeight={600}>{v}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Multi-supplier controls */}
      <Paper sx={{ p: 1.5, mb: 2, border: `1px solid ${FI_ORANGE}`, backgroundColor: '#fff9f0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <SwapHorizIcon sx={{ color: FI_ORANGE }} />
          <Typography variant="subtitle2" fontWeight={700}>Multi-supplier controls:</Typography>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <Select value={poSupplier} onChange={e => switchAll(e.target.value)}
              displayEmpty renderValue={v => `Switch all → ${SUPPLIERS.find(s => s.id === v)?.name}`}>
              {SUPPLIERS.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>({s.terms})</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider orientation="vertical" flexItem />
          <Tooltip title="Switches each line to its cheapest available supplier">
            <Button variant="contained" size="small" startIcon={<AutoFixHighIcon />} onClick={optimise}
              sx={{ backgroundColor: '#2e7d32', textTransform: 'none', '&:hover': { backgroundColor: '#1b5e20' } }}>
              Auto-optimise by price
            </Button>
          </Tooltip>
        </Stack>
      </Paper>

      {/* Line items */}
      <Paper sx={{ border: '1px solid #e0e0e0', mb: 2, overflow: 'hidden' }}>
        <Box sx={{ backgroundColor: '#f5f0ff', px: 2, py: 1 }}>
          <Typography variant="caption" fontWeight={700} color={FI_PURPLE}>
            Job: 3701 · General Service · 19 Mar 2026 · Factory Pools
          </Typography>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              {['Type', 'Job type', 'Category', 'Code', 'Description', 'Qty', 'Supplier', 'Purchase $', 'Markup %', 'Sales $', 'Tax', 'Amount', ''].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: '#555', whiteSpace: 'nowrap' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map(line => {
              const product = PRODUCTS.find(p => p.code === line.inventoryCode);
              const purchase = PRICE_BOOKS[line.supplierId]?.[line.inventoryCode] ?? product?.purchasePrice ?? 0;
              const markup = product?.markup ?? 65;
              const salesP = purchase * (1 + markup / 100);
              const best = cheapest(line.inventoryCode);
              const isBest = best === line.supplierId;
              const saving = isBest ? 0 : (purchase - (PRICE_BOOKS[best]?.[line.inventoryCode] ?? purchase));
              return (
                <TableRow key={line.id} hover>
                  <TableCell sx={{ fontSize: '0.75rem' }}>Product</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>—</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>—</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: FI_ORANGE, fontWeight: 700, fontFamily: 'monospace' }}>
                      {line.inventoryCode}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{line.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{line.qty}.00</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <FormControl size="small">
                        <Select value={line.supplierId} onChange={e => updateLine(line.id, e.target.value)}
                          variant="standard" disableUnderline
                          renderValue={v => (
                            <Chip label={SUPPLIERS.find(s => s.id === v)?.code}
                              size="small"
                              sx={{ backgroundColor: isBest ? '#2e7d32' : FI_PURPLE, color: '#fff', fontWeight: 700, fontSize: '0.65rem' }} />
                          )}>
                          {SUPPLIERS.map(s => {
                            const p = PRICE_BOOKS[s.id]?.[line.inventoryCode];
                            if (p === undefined) return null;
                            const isC = s.id === best;
                            return (
                              <MenuItem key={s.id} value={s.id}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <span>{s.name}</span>
                                  <Typography variant="caption" color="text.secondary">${p.toFixed(2)}</Typography>
                                  {isC && <Chip label="cheapest" size="small" color="success" sx={{ fontSize: '0.6rem', height: 16 }} />}
                                </Stack>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {!isBest && saving > 0.01 && (
                        <Tooltip title={`${SUPPLIERS.find(s => s.id === best)?.name} is $${saving.toFixed(2)} cheaper`}>
                          <Chip label={`-$${saving.toFixed(2)}`} size="small" color="warning" sx={{ fontSize: '0.6rem', height: 16 }} />
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{purchase.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{markup}.00</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{salesP.toFixed(2)}</TableCell>
                  <TableCell><Chip label="YES" size="small" color="success" sx={{ fontSize: '0.65rem' }} /></TableCell>
                  <TableCell sx={{ fontSize: '0.78rem', fontWeight: 700 }}>{purchase.toFixed(2)}</TableCell>
                  <TableCell><IconButton size="small"><DeleteIcon sx={{ fontSize: 14, color: '#ccc' }} /></IconButton></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Box sx={{ p: 1.5, borderTop: '1px solid #f0f0f0' }}>
          <Button size="small" startIcon={<AddIcon />} sx={{ color: FI_ORANGE, textTransform: 'none' }}>+ Item</Button>
        </Box>
      </Paper>

      {/* Totals */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Paper sx={{ p: 2, minWidth: 260, border: '1px solid #e0e0e0' }}>
          {[
            ['Total Services (Ex)', '$0.00'],
            ['Total Products (Ex)', `$${total.toFixed(2)}`],
            ['Subtotal', `$${total.toFixed(2)}`],
            ['Tax amount', `$${totalGst.toFixed(2)}`],
          ].map(([l, v]) => (
            <Stack key={l} direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="text.secondary">{l}</Typography>
              <Typography variant="caption">{v}</Typography>
            </Stack>
          ))}
          <Divider sx={{ my: 0.5 }} />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" fontWeight={800}>TOTAL</Typography>
            <Typography variant="body2" fontWeight={800}>${(total + totalGst).toFixed(2)}</Typography>
          </Stack>
        </Paper>
      </Box>

      {/* Action buttons */}
      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
        {['Close', 'Preview', 'Download', 'Email', 'Copy', 'Create job', 'Submit', 'Receive all'].map(b => (
          <Button key={b} variant="contained" size="small"
            sx={{
              backgroundColor: ['Submit', 'Receive all'].includes(b) ? FI_ORANGE : FI_PURPLE,
              textTransform: 'none', fontSize: '0.78rem',
            }}>
            {b}
          </Button>
        ))}
        <Button variant="contained" size="small"
          sx={{ backgroundColor: '#c62828', textTransform: 'none', fontSize: '0.78rem' }}>Delete</Button>
      </Stack>
    </Box>
  );
};
