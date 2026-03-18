import React, { useState } from 'react';
import {
  Box, Container, Typography, Button, Chip, Divider,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel, IconButton,
  Tooltip, Alert, Stack, Card, CardContent, LinearProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// ── Mock data ──────────────────────────────────────────────────────────────────

const SUPPLIERS = [
  { id: 'sup1', name: 'Plumbing World', discount: 0.12, color: '#1976d2' },
  { id: 'sup2', name: 'Reece Plumbing', discount: 0.08, color: '#388e3c' },
  { id: 'sup3', name: 'Tradelink',      discount: 0.15, color: '#f57c00' },
];

const PRICE_BOOKS: Record<string, Record<string, number>> = {
  sup1: { 'Copper Pipe 15mm (m)': 8.40,  'Ball Valve 15mm': 12.50, 'Flex Hose 300mm': 6.90,  'Isolation Valve': 18.00, 'P-Trap 40mm': 9.20  },
  sup2: { 'Copper Pipe 15mm (m)': 9.10,  'Ball Valve 15mm': 11.80, 'Flex Hose 300mm': 7.40,  'Isolation Valve': 16.50, 'P-Trap 40mm': 8.75  },
  sup3: { 'Copper Pipe 15mm (m)': 7.95,  'Ball Valve 15mm': 13.20, 'Flex Hose 300mm': 6.50,  'Isolation Valve': 17.20, 'P-Trap 40mm': 9.80  },
};

const INITIAL_LINES = [
  { id: 1, item: 'Copper Pipe 15mm (m)', qty: 10, supplierId: 'sup1' },
  { id: 2, item: 'Ball Valve 15mm',       qty: 4,  supplierId: 'sup1' },
  { id: 3, item: 'Flex Hose 300mm',       qty: 6,  supplierId: 'sup2' },
  { id: 4, item: 'Isolation Valve',       qty: 2,  supplierId: 'sup3' },
];

const ITEMS = Object.keys(PRICE_BOOKS.sup1);
const MARGIN_TARGET = 0.30;

// ── Helpers ────────────────────────────────────────────────────────────────────

function unitCost(supplierId: string, item: string) {
  const book = PRICE_BOOKS[supplierId];
  return book?.[item] ?? 0;
}

function unitPrice(supplierId: string, item: string) {
  const cost = unitCost(supplierId, item);
  return cost > 0 ? cost / (1 - MARGIN_TARGET) : 0;
}

function margin(supplierId: string, item: string) {
  const cost = unitCost(supplierId, item);
  const price = unitPrice(supplierId, item);
  return price > 0 ? (price - cost) / price : 0;
}

function cheapestSupplier(item: string) {
  return SUPPLIERS.reduce((best, s) =>
    unitCost(s.id, item) < unitCost(best.id, item) ? s : best
  );
}

// ── Components ─────────────────────────────────────────────────────────────────

interface Line { id: number; item: string; qty: number; supplierId: string; }

function MarginChip({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const ok = value >= MARGIN_TARGET - 0.02;
  return (
    <Chip
      size="small"
      icon={ok ? <CheckCircleIcon /> : <WarningAmberIcon />}
      label={`${pct}%`}
      color={ok ? 'success' : 'warning'}
      variant="outlined"
    />
  );
}

function SupplierBadge({ supplierId }: { supplierId: string }) {
  const s = SUPPLIERS.find(x => x.id === supplierId);
  if (!s) return null;
  return (
    <Chip
      size="small"
      label={s.name}
      sx={{ backgroundColor: s.color, color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}
    />
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
  const [globalSupplier, setGlobalSupplier] = useState('');
  const [switched, setSwitched] = useState(false);

  const totalCost  = lines.reduce((s, l) => s + unitCost(l.supplierId, l.item) * l.qty, 0);
  const totalPrice = lines.reduce((s, l) => s + unitPrice(l.supplierId, l.item) * l.qty, 0);
  const totalMargin = totalPrice > 0 ? (totalPrice - totalCost) / totalPrice : 0;

  const updateLine = (id: number, field: keyof Line, value: any) =>
    setLines(ls => ls.map(l => l.id === id ? { ...l, [field]: value } : l));

  const removeLine = (id: number) => setLines(ls => ls.filter(l => l.id !== id));

  const addLine = () => setLines(ls => [
    ...ls,
    { id: Date.now(), item: ITEMS[0], qty: 1, supplierId: 'sup1' }
  ]);

  const switchAllToSupplier = (supplierId: string) => {
    setLines(ls => ls.map(l => ({ ...l, supplierId })));
    setGlobalSupplier(supplierId);
    setSwitched(true);
    setTimeout(() => setSwitched(false), 3000);
  };

  const optimiseByPrice = () => {
    setLines(ls => ls.map(l => ({ ...l, supplierId: cheapestSupplier(l.item).id })));
    setSwitched(true);
    setTimeout(() => setSwitched(false), 3000);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', pb: 6 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#1a1d27', color: '#fff', px: 3, py: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="overline" sx={{ color: '#00e5b0', letterSpacing: 2, fontSize: '0.7rem' }}>
              FIELDINSIGHT · PROTOTYPE
            </Typography>
            <Typography variant="h6" fontWeight={800}>PO Multi-Supplier Price Books</Typography>
            <Typography variant="caption" sx={{ color: '#8b90b8' }}>
              PO-2026-0184 · Hot Water System Replacement · 18 Mar 2026
            </Typography>
          </Box>
          <Chip label="Draft" sx={{ backgroundColor: '#2e3250', color: '#8b90b8', fontWeight: 700 }} />
        </Stack>
      </Box>

      <Container maxWidth="lg">
        {switched && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Supplier updated across all line items.
          </Alert>
        )}

        {/* Summary cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
          {[
            { label: 'Total Cost',   value: `$${totalCost.toFixed(2)}`,   color: '#ff6b6b' },
            { label: 'Total Price',  value: `$${totalPrice.toFixed(2)}`,  color: '#00e5b0' },
            { label: 'Gross Margin', value: `${Math.round(totalMargin * 100)}%`, color: totalMargin >= MARGIN_TARGET - 0.02 ? '#4ade80' : '#ffa94d' },
          ].map(c => (
            <Card key={c.label} sx={{ flex: 1, border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="caption" color="text.secondary">{c.label}</Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: c.color }}>{c.value}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Supplier controls */}
        <Paper sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 160 }}>
              Switch all suppliers:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select supplier</InputLabel>
              <Select
                value={globalSupplier}
                label="Select supplier"
                onChange={e => switchAllToSupplier(e.target.value)}
              >
                {SUPPLIERS.map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Switch each line to the cheapest available supplier">
              <Button
                variant="outlined"
                startIcon={<SwapHorizIcon />}
                onClick={optimiseByPrice}
                color="success"
              >
                Auto-optimise by price
              </Button>
            </Tooltip>
          </Stack>
        </Paper>

        {/* Line items table */}
        <Paper sx={{ border: '1px solid #e0e0e0', mb: 2, overflow: 'hidden' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f0f2ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Item</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Qty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Supplier</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Unit Cost</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Margin</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.map(line => {
                const cost  = unitCost(line.supplierId, line.item);
                const price = unitPrice(line.supplierId, line.item);
                const best  = cheapestSupplier(line.item);
                const isBest = best.id === line.supplierId;
                return (
                  <TableRow key={line.id} hover>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={line.item}
                          onChange={e => updateLine(line.id, 'item', e.target.value)}
                          variant="standard"
                          disableUnderline
                          sx={{ fontWeight: 600 }}
                        >
                          {ITEMS.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <Select
                        value={line.qty}
                        onChange={e => updateLine(line.id, 'qty', Number(e.target.value))}
                        size="small"
                        variant="standard"
                        disableUnderline
                        sx={{ width: 60, textAlign: 'right' }}
                      >
                        {[1,2,3,4,5,6,8,10,12,15,20].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FormControl size="small">
                          <Select
                            value={line.supplierId}
                            onChange={e => updateLine(line.id, 'supplierId', e.target.value)}
                            variant="standard"
                            disableUnderline
                            renderValue={v => <SupplierBadge supplierId={v as string} />}
                          >
                            {SUPPLIERS.map(s => (
                              <MenuItem key={s.id} value={s.id}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <SupplierBadge supplierId={s.id} />
                                  <Typography variant="caption" color="text.secondary">
                                    ${unitCost(s.id, line.item).toFixed(2)}
                                  </Typography>
                                  {s.id === best.id && (
                                    <Chip label="best price" size="small" color="success" sx={{ fontSize: '0.6rem', height: 16 }} />
                                  )}
                                </Stack>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {!isBest && (
                          <Tooltip title={`${best.name} is $${(cost - unitCost(best.id, line.item)).toFixed(2)} cheaper per unit`}>
                            <WarningAmberIcon sx={{ fontSize: 14, color: '#ffa94d' }} />
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">${cost.toFixed(2)}</TableCell>
                    <TableCell align="right">${price.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      ${(price * line.qty).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <MarginChip value={margin(line.supplierId, line.item)} />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => removeLine(line.id)} color="error">
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box sx={{ p: 1.5, borderTop: '1px solid #e0e0e0' }}>
            <Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={addLine}>
              Add line item
            </Button>
          </Box>
        </Paper>

        {/* Margin bar */}
        <Paper sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" fontWeight={700}>Overall Margin</Typography>
            <Typography variant="caption" color="text.secondary">Target: {MARGIN_TARGET * 100}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(totalMargin * 100, 100)}
            color={totalMargin >= MARGIN_TARGET - 0.02 ? 'success' : 'warning'}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Stack direction="row" justifyContent="space-between" mt={0.5}>
            <Typography variant="caption" color="text.secondary">0%</Typography>
            <Typography variant="caption" fontWeight={700}>
              {Math.round(totalMargin * 100)}% — ${(totalPrice - totalCost).toFixed(2)} gross profit
            </Typography>
            <Typography variant="caption" color="text.secondary">50%</Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
