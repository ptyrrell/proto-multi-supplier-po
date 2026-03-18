import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Stack, Chip, Alert, Divider, TextField,
  InputAdornment, Select, MenuItem, FormControl
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';
import { SUPPLIERS, PRODUCTS, PRICE_BOOKS } from '../data/mockData';

const FI_ORANGE = '#F57C00';
const FI_PURPLE = '#674EA7';
const FI_BLUE   = '#027BFF';

interface ImportedRow { code: string; description: string; price: number; valid: boolean; matched: boolean; }

export const SupplierPriceBooksPage: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('sup1');
  const [importRows, setImportRows] = useState<ImportedRow[]>([]);
  const [importDone, setImportDone] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const supplier = SUPPLIERS.find(s => s.id === selectedSupplier)!;
  const priceBook = PRICE_BOOKS[selectedSupplier] || {};

  const matchedProducts = PRODUCTS.filter(p => priceBook[p.code] !== undefined);
  const filtered = matchedProducts.filter(p =>
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').slice(1).filter(l => l.trim());
      const parsed: ImportedRow[] = lines.map(line => {
        const [code, description, priceStr] = line.split(',').map(s => s.trim().replace(/"/g, ''));
        const price = parseFloat(priceStr) || 0;
        const matched = PRODUCTS.some(p => p.code === code);
        return { code, description: description || code, price, valid: !!code && price > 0, matched };
      });
      setImportRows(parsed);
      setImportDone(false);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    setImportDone(true);
    setImportRows([]);
  };

  const downloadTemplate = () => {
    const csv = 'Item Code,Description,Unit Price\nWA5364,Air filter,25.74\nWACF0215,Cabin Filter,7.25\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'price-book-template.csv'; a.click();
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: FI_PURPLE }}>Supplier Price Books</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage per-supplier pricing for inventory items. Import a CSV price list from any supplier.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<FileDownloadIcon />}
            onClick={downloadTemplate} sx={{ textTransform: 'none' }}>
            Download template
          </Button>
          <Button variant="contained" size="small" startIcon={<FileUploadIcon />}
            onClick={() => fileRef.current?.click()}
            sx={{ backgroundColor: FI_ORANGE, textTransform: 'none', '&:hover': { backgroundColor: '#e65100' } }}>
            Import price book CSV
          </Button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
        </Stack>
      </Stack>

      {/* Supplier selector */}
      <Paper sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Typography variant="subtitle2" fontWeight={700} sx={{ minWidth: 120 }}>Viewing price book for:</Typography>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <Select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
              {SUPPLIERS.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={s.code} size="small"
                      sx={{ backgroundColor: FI_PURPLE, color: '#fff', fontWeight: 700, fontSize: '0.65rem' }} />
                    <span>{s.name}</span>
                    <Typography variant="caption" color="text.secondary">({s.terms})</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider orientation="vertical" flexItem />
          <Stack direction="row" spacing={2}>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight={800} sx={{ color: FI_PURPLE }}>{matchedProducts.length}</Typography>
              <Typography variant="caption" color="text.secondary">Products priced</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight={800} sx={{ color: FI_ORANGE }}>
                ${Math.min(...matchedProducts.map(p => priceBook[p.code] || 999)).toFixed(2)}–${Math.max(...matchedProducts.map(p => priceBook[p.code] || 0)).toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Price range</Typography>
            </Box>
          </Stack>
          <Box flex={1} />
          <Button variant="contained" size="small" startIcon={<AddIcon />}
            sx={{ backgroundColor: FI_BLUE, textTransform: 'none' }}>
            Add supplier
          </Button>
        </Stack>
      </Paper>

      {/* Import preview */}
      {importRows.length > 0 && (
        <Paper sx={{ p: 2, mb: 3, border: `2px solid ${FI_ORANGE}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              Import Preview — {importRows.length} rows from CSV
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={`${importRows.filter(r => r.matched).length} matched`} size="small" color="success" />
              <Chip label={`${importRows.filter(r => !r.matched).length} unmatched`} size="small" color="warning" />
            </Stack>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fff9f0' }}>
                {['Item Code', 'Description', 'Unit Price', 'Status'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {importRows.slice(0, 8).map((r, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>{r.code}</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{r.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600 }}>${r.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {r.matched
                      ? <Chip icon={<CheckCircleIcon />} label="Matched" size="small" color="success" sx={{ fontSize: '0.65rem' }} />
                      : <Chip icon={<WarningAmberIcon />} label="New item" size="small" color="warning" sx={{ fontSize: '0.65rem' }} />
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Stack direction="row" spacing={1} mt={1.5} justifyContent="flex-end">
            <Button size="small" onClick={() => setImportRows([])} sx={{ textTransform: 'none' }}>Cancel</Button>
            <Button variant="contained" size="small" onClick={handleConfirmImport}
              sx={{ backgroundColor: FI_ORANGE, textTransform: 'none' }}>
              Confirm import ({importRows.filter(r => r.valid).length} items)
            </Button>
          </Stack>
        </Paper>
      )}

      {importDone && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setImportDone(false)}>
          Price book imported successfully for {supplier.name}.
        </Alert>
      )}

      {/* Price book table */}
      <Stack direction="row" spacing={1} mb={1.5} alignItems="center">
        <TextField placeholder="Search products..." size="small" value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ width: 240 }} />
        <Typography variant="caption" color="text.secondary">
          {filtered.length} of {PRODUCTS.length} products have a price for {supplier.name}
        </Typography>
      </Stack>

      <Paper sx={{ border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f0ff' }}>
              {['Item Code', 'Description', 'Category', `${supplier.name} Price`, 'Markup %', 'Sales Price', 'vs Primary', ''].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: FI_PURPLE }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(p => {
              const price = priceBook[p.code] || 0;
              const primaryPrice = PRICE_BOOKS[p.primarySupplier]?.[p.code] || p.purchasePrice;
              const diff = price - primaryPrice;
              const salesP = price * (1 + p.markup / 100);
              return (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: FI_ORANGE, fontWeight: 700, fontFamily: 'monospace' }}>
                      {p.code}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{p.description}</TableCell>
                  <TableCell><Chip label={p.category || '—'} size="small" sx={{ fontSize: '0.65rem' }} /></TableCell>
                  <TableCell>
                    <TextField defaultValue={price.toFixed(2)} size="small" variant="outlined"
                      sx={{ width: 80, '& input': { fontSize: '0.78rem', py: 0.5, textAlign: 'right' } }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{p.markup}%</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600 }}>${salesP.toFixed(2)}</TableCell>
                  <TableCell>
                    {Math.abs(diff) < 0.01
                      ? <Chip label="Same" size="small" sx={{ fontSize: '0.65rem', backgroundColor: '#f5f5f5' }} />
                      : diff < 0
                        ? <Chip label={`$${Math.abs(diff).toFixed(2)} cheaper`} size="small" color="success" sx={{ fontSize: '0.65rem' }} />
                        : <Chip label={`$${diff.toFixed(2)} more`} size="small" color="warning" sx={{ fontSize: '0.65rem' }} />
                    }
                  </TableCell>
                  <TableCell>
                    <Button size="small" sx={{ textTransform: 'none', fontSize: '0.7rem', color: FI_PURPLE, p: 0 }}>
                      Set as primary
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
