import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Chip, Select, MenuItem, FormControl, Dialog, DialogTitle,
  DialogContent, DialogActions, Tabs, Tab, Stack,
  IconButton, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import { PRODUCTS, SUPPLIERS, PRICE_BOOKS } from '../data/mockData';

const FI_ORANGE = '#F57C00';
const FI_PURPLE = '#674EA7';
const FI_BLUE   = '#027BFF';

function salesPrice(purchase: number, markup: number) {
  return purchase * (1 + markup / 100);
}

function ProductEditDialog({ product, open, onClose }: any) {
  const [tab, setTab] = useState(0);
  const supplierPricing = SUPPLIERS.map(s => ({
    ...s,
    purchase: PRICE_BOOKS[s.id]?.[product?.code] ?? product?.purchasePrice ?? 0,
    markup: product?.markup ?? 65,
    sales: salesPrice(PRICE_BOOKS[s.id]?.[product?.code] ?? product?.purchasePrice ?? 0, product?.markup ?? 65),
  }));

  if (!product) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>
        <Typography variant="h6" fontWeight={700}>Edit Product</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2} mt={1}>
          <TextField
            defaultValue={product.code + ' — ' + product.description}
            multiline rows={2} fullWidth size="small"
            label="Description"
            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f5f0ff' } }}
          />
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select defaultValue={product.primarySupplier} variant="outlined" size="small">
                {SUPPLIERS.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Supplier</Typography>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {[
              { label: 'Purchase price', value: product.purchasePrice.toFixed(2) },
              { label: 'Markup percentage', value: product.markup },
              { label: 'Sales price', value: salesPrice(product.purchasePrice, product.markup).toFixed(2) },
              { label: 'Tax', value: 'YES', select: true },
            ].map(f => (
              <TextField key={f.label} label={f.label} defaultValue={f.value}
                size="small" sx={{ flex: 1, '& .MuiOutlinedInput-root': { backgroundColor: '#f5f0ff' } }} />
            ))}
          </Stack>
        </Stack>

        <Box sx={{ borderBottom: '1px solid #e0e0e0', mt: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            TabIndicatorProps={{ style: { backgroundColor: FI_ORANGE } }}
            sx={{ '& .Mui-selected': { color: `${FI_ORANGE} !important` }, '& .MuiTab-root': { textTransform: 'none' } }}>
            <Tab label="Transactions" />
            <Tab label="Supplier Pricing" />
          </Tabs>
        </Box>

        {tab === 1 && (
          <Box mt={2}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  {['Supplier Code', 'Supplier', 'Purchase $', 'Mark up %', 'Sales $', 'Tax'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {supplierPricing.map((s, i) => (
                  <TableRow key={s.id} sx={{ backgroundColor: i === 0 ? '#fff9f0' : undefined }}>
                    <TableCell>
                      <Chip label={s.code} size="small"
                        sx={{ backgroundColor: i === 0 ? FI_ORANGE : '#e0e0e0', color: i === 0 ? '#fff' : '#333', fontWeight: 700, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.78rem' }}>{s.name}</TableCell>
                    <TableCell>
                      <TextField defaultValue={s.purchase.toFixed(2)} size="small" variant="outlined"
                        sx={{ width: 80, '& input': { fontSize: '0.78rem', py: 0.4 } }} />
                    </TableCell>
                    <TableCell>
                      <TextField defaultValue={s.markup} size="small" variant="outlined"
                        sx={{ width: 60, '& input': { fontSize: '0.78rem', py: 0.4 } }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{s.sales.toFixed(2)}</TableCell>
                    <TableCell><Chip label="YES" size="small" color="success" sx={{ fontSize: '0.65rem' }} /></TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6}>
                    <Button size="small" startIcon={<AddIcon />} sx={{ color: FI_ORANGE, textTransform: 'none' }}>
                      Add supplier price
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}

        {tab === 0 && (
          <Box mt={2} sx={{ color: 'text.secondary', fontSize: '0.82rem', textAlign: 'center', py: 3 }}>
            No transactions found for this product.
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="contained" sx={{ backgroundColor: FI_ORANGE, textTransform: 'none', '&:hover': { backgroundColor: '#e65100' } }}>Save</Button>
        <Button variant="contained" sx={{ backgroundColor: FI_ORANGE, textTransform: 'none', '&:hover': { backgroundColor: '#e65100' } }}>Save & Copy</Button>
        <Button variant="contained" sx={{ backgroundColor: FI_PURPLE, textTransform: 'none' }}>Edit Stock</Button>
        <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none' }}>Cancel</Button>
        <Box flex={1} />
        <Button variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ textTransform: 'none' }}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState<any>(null);

  const filtered = PRODUCTS.filter(p =>
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Toolbar */}
      <Stack direction="row" spacing={1} alignItems="center" mb={2} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select defaultValue="" displayEmpty size="small">
            <MenuItem value=""><em>Search supplier</em></MenuItem>
            {SUPPLIERS.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField placeholder="Search text..." size="small" value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ width: 220 }} />
        <Button variant="contained" size="small" sx={{ backgroundColor: FI_ORANGE, textTransform: 'none', '&:hover': { backgroundColor: '#e65100' } }}>
          Search
        </Button>
        <Box flex={1} />
        <Button variant="contained" size="small" startIcon={<AddIcon />}
          sx={{ backgroundColor: FI_BLUE, textTransform: 'none' }}>
          + Add Item
        </Button>
        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Delete (0)</Button>
        <Button variant="contained" size="small" sx={{ backgroundColor: FI_PURPLE, textTransform: 'none' }}>Export</Button>
      </Stack>
      <Stack direction="row" spacing={1} mb={2}>
        <Button variant="contained" size="small" startIcon={<FileUploadIcon />}
          sx={{ backgroundColor: FI_ORANGE, textTransform: 'none' }}>Import</Button>
        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Settings</Button>
        <Button variant="outlined" size="small" startIcon={<PrintIcon />} sx={{ textTransform: 'none' }}>Print QR (0)</Button>
        <Button variant="contained" size="small" startIcon={<RefreshIcon />}
          sx={{ backgroundColor: FI_PURPLE, textTransform: 'none' }}>Replenish</Button>
      </Stack>

      <Paper sx={{ border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f0ff' }}>
              <TableCell padding="checkbox" />
              {['Category', 'Code', 'Description', 'Purchase order', 'Amount', 'Markup %', 'Stock', 'Min Stock', 'Order Stock', 'Action'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: FI_PURPLE, cursor: h === 'Code' ? 'pointer' : undefined }}>
                  {h}{h === 'Code' ? ' ▾' : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(p => {
              const allSupplierCount = Object.values(PRICE_BOOKS).filter(book => book[p.code] !== undefined).length;
              return (
                <TableRow key={p.id} hover sx={{ '&:hover': { backgroundColor: '#fffbe6' } }}>
                  <TableCell padding="checkbox">
                    <Box sx={{ width: 12, height: 12, backgroundColor: '#bdbdbd', borderRadius: '2px', ml: 0.5 }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {p.category || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: FI_ORANGE, fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => setEditProduct(p)}>
                      {p.code}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{p.description}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>0.00</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{p.purchasePrice.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{p.markup}.00</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: p.stock === 0 ? '#999' : undefined }}>{p.stock.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>{p.minStock.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>0.00</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Tooltip title={`${allSupplierCount} supplier price${allSupplierCount !== 1 ? 's' : ''}`}>
                        <Chip label={`${allSupplierCount} sup`} size="small"
                          sx={{ fontSize: '0.6rem', height: 18, backgroundColor: allSupplierCount > 1 ? '#e8f5e9' : '#f5f5f5',
                            color: allSupplierCount > 1 ? '#2e7d32' : '#999', cursor: 'pointer' }}
                          onClick={() => setEditProduct(p)} />
                      </Tooltip>
                      <IconButton size="small" onClick={() => setEditProduct(p)}>
                        <EditIcon sx={{ fontSize: 14, color: FI_ORANGE }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <ProductEditDialog product={editProduct} open={!!editProduct} onClose={() => setEditProduct(null)} />
    </Box>
  );
};
