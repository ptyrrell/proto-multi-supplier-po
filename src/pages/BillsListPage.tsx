import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, TextField, InputAdornment, Tooltip,
  Avatar, Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import { useNavigate } from 'react-router-dom';
import { BILLS, SUPPLIERS } from '../data/mockData';

const FI_PURPLE = '#674EA7';

const STATUS_CONFIG: Record<string, { color: 'default' | 'primary' | 'success' | 'warning' | 'error'; label: string }> = {
  Draft:    { color: 'default',  label: 'Draft' },
  Approved: { color: 'primary',  label: 'Approved' },
  Paid:     { color: 'success',  label: 'Paid' },
  Disputed: { color: 'error',    label: 'Disputed' },
};

const fmt = (n: number) => `$${n.toFixed(2)}`;

export const BillsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = BILLS.filter(b => {
    const sup = SUPPLIERS.find(s => s.id === b.supplierId);
    const q = search.toLowerCase();
    return (
      b.billNo.toLowerCase().includes(q) ||
      b.supplierInvoiceNo.toLowerCase().includes(q) ||
      b.jobRef.toLowerCase().includes(q) ||
      (b.linkedPoId || '').toLowerCase().includes(q) ||
      (sup?.name || '').toLowerCase().includes(q)
    );
  });

  const totalValue = BILLS.reduce((s, b) => s + b.totalIncGst, 0);
  const pending    = BILLS.filter(b => b.status === 'Draft' || b.status === 'Approved').length;
  const paid       = BILLS.filter(b => b.status === 'Paid').length;
  const disputed   = BILLS.filter(b => b.status === 'Disputed').length;

  const summaryCards = [
    { label: 'Total Bills',  value: BILLS.length,         color: FI_PURPLE, sub: 'all time' },
    { label: 'Pending',      value: pending,               color: '#027BFF', sub: 'to approve / pay' },
    { label: 'Paid',         value: paid,                  color: '#2e7d32', sub: 'this month' },
    { label: 'Disputed',     value: disputed,              color: '#c62828', sub: 'needs review' },
    { label: 'Total Value',  value: fmt(totalValue),       color: '#5d4037', sub: 'inc. GST' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ReceiptLongIcon sx={{ color: FI_PURPLE, fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', lineHeight: 1.2 }}>
              Bills
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Supplier invoices — upload PDFs and process line items
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: FI_PURPLE, textTransform: 'none', fontWeight: 600 }}
          onClick={() => navigate('/bills/new')}
        >
          New Bill
        </Button>
      </Box>

      {/* Summary cards */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
        {summaryCards.map(c => (
          <Paper key={c.label} elevation={0} sx={{
            flex: '1 1 140px', p: 1.5, border: '1px solid #e8e0f5',
            borderTop: `3px solid ${c.color}`, borderRadius: 1,
          }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: c.color, lineHeight: 1 }}>
              {c.value}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#555', mt: 0.3 }}>{c.label}</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#aaa' }}>{c.sub}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Search */}
      <Box sx={{ mb: 1.5 }}>
        <TextField
          size="small"
          placeholder="Search bills, supplier, invoice #, job…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: 340 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#aaa' }} /></InputAdornment>,
          }}
        />
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f0ff' }}>
              {['Bill #', 'Date', 'Supplier', 'Supplier Inv #', 'Linked PO', 'Job', 'Ex GST', 'GST', 'Total', 'Status', ''].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: FI_PURPLE, py: 1 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((bill, idx) => {
              const sup = SUPPLIERS.find(s => s.id === bill.supplierId);
              const cfg = STATUS_CONFIG[bill.status];
              return (
                <TableRow
                  key={bill.id}
                  hover
                  sx={{ cursor: 'pointer', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                  onClick={() => navigate(`/bills/${bill.id}`)}
                >
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: FI_PURPLE }}>
                    {bill.billNo}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#555' }}>{bill.date}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Avatar sx={{ width: 22, height: 22, fontSize: '0.6rem', backgroundColor: FI_PURPLE }}>
                        {sup?.code.slice(0, 2)}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.75rem' }}>{sup?.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.72rem', color: '#666' }}>{bill.supplierInvoiceNo}</TableCell>
                  <TableCell>
                    {bill.linkedPoId ? (
                      <Tooltip title="View linked PO">
                        <Chip
                          icon={<LinkIcon sx={{ fontSize: 12 }} />}
                          label={bill.linkedPoId}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.65rem', color: '#027BFF', borderColor: '#027BFF', height: 20, cursor: 'pointer' }}
                          onClick={e => { e.stopPropagation(); navigate('/purchase-orders-list'); }}
                        />
                      </Tooltip>
                    ) : (
                      <Typography sx={{ fontSize: '0.72rem', color: '#bbb' }}>—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {bill.jobRef ? (
                      <Chip label={bill.jobRef} size="small"
                        sx={{ fontSize: '0.65rem', backgroundColor: '#fff8e1', color: '#f57c00', fontWeight: 600, height: 20 }} />
                    ) : (
                      <Typography sx={{ fontSize: '0.72rem', color: '#bbb' }}>—</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{fmt(bill.subtotalExGst)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right', color: '#888' }}>{fmt(bill.totalGst)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'right' }}>{fmt(bill.totalIncGst)}</TableCell>
                  <TableCell>
                    <Chip label={cfg.label} color={cfg.color} size="small"
                      sx={{ fontSize: '0.65rem', fontWeight: 600, height: 20 }} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View Bill">
                        <Button size="small" variant="outlined"
                          startIcon={<VisibilityIcon sx={{ fontSize: 12 }} />}
                          sx={{ textTransform: 'none', fontSize: '0.65rem', py: 0.2, borderColor: FI_PURPLE, color: FI_PURPLE, minWidth: 'unset' }}
                          onClick={e => { e.stopPropagation(); navigate(`/bills/${bill.id}`); }}
                        >
                          View
                        </Button>
                      </Tooltip>
                      {!bill.pdfUploaded && (
                        <Tooltip title="Upload & Process PDF">
                          <Button size="small" variant="contained"
                            startIcon={<UploadFileIcon sx={{ fontSize: 12 }} />}
                            sx={{ textTransform: 'none', fontSize: '0.65rem', py: 0.2, backgroundColor: '#f57c00', minWidth: 'unset' }}
                            onClick={e => { e.stopPropagation(); navigate(`/bills/${bill.id}`); }}
                          >
                            Upload
                          </Button>
                        </Tooltip>
                      )}
                    </Stack>
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
