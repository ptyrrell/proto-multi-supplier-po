import React, { useState } from 'react';
import {
  Box, Typography, Paper, Stack, Chip, Button, Table,
  TableBody, TableCell, TableHead, TableRow, Tooltip,
  TextField, InputAdornment, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';

const FI_PURPLE = '#674EA7';
const FI_ORANGE = '#F57C00';
const FI_BLUE = '#027BFF';

type PoStatus = 'Draft' | 'Sent' | 'Partially Received' | 'Received' | 'Billed';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplier: string;
  supplierCode: string;
  reference: string;
  lines: number;
  totalExGst: number;
  gst: number;
  status: PoStatus;
  deliveryDate?: string;
  notes?: string;
}

const STATUS_CONFIG: Record<PoStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  Draft:               { color: '#666',    bg: '#f5f5f5', icon: <EditIcon sx={{ fontSize: 12 }} /> },
  Sent:                { color: '#1565c0', bg: '#e3f2fd', icon: <LocalShippingIcon sx={{ fontSize: 12 }} /> },
  'Partially Received':{ color: '#e65100', bg: '#fff3e0', icon: <ScheduleIcon sx={{ fontSize: 12 }} /> },
  Received:            { color: '#1b5e20', bg: '#e8f5e9', icon: <CheckCircleIcon sx={{ fontSize: 12 }} /> },
  Billed:              { color: '#4a148c', bg: '#f3e5f5', icon: <CheckCircleIcon sx={{ fontSize: 12 }} /> },
};

const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po1', poNumber: 'PO-4571', date: '2026-03-18',
    supplier: 'Auto Parts Distribution (NEW)', supplierCode: 'APD',
    reference: 'JOB-2026-0142', lines: 4, totalExGst: 59.06, gst: 5.91,
    status: 'Received', deliveryDate: '2026-03-19',
    notes: 'Filters for 2022 Isuzu NPR'
  },
  {
    id: 'po2', poNumber: 'PO-4570', date: '2026-03-17',
    supplier: 'JAS Oceania Pty Ltd', supplierCode: 'JAS',
    reference: 'JOB-2026-0139', lines: 2, totalExGst: 165.30, gst: 16.53,
    status: 'Sent', deliveryDate: '2026-03-20',
  },
  {
    id: 'po3', poNumber: 'PO-4569', date: '2026-03-15',
    supplier: 'Repco', supplierCode: 'REPCO',
    reference: 'JOB-2026-0135', lines: 6, totalExGst: 290.00, gst: 29.00,
    status: 'Billed',
  },
  {
    id: 'po4', poNumber: 'PO-4568', date: '2026-03-12',
    supplier: 'Auto Parts Distribution (NEW)', supplierCode: 'APD',
    reference: 'STOCK-TOP-UP', lines: 8, totalExGst: 212.45, gst: 21.25,
    status: 'Partially Received', deliveryDate: '2026-03-14',
    notes: 'Partial — awaiting WZ418NM x5'
  },
  {
    id: 'po5', poNumber: 'PO-4560', date: '2026-02-25',
    supplier: 'JAS Oceania Pty Ltd', supplierCode: 'JAS',
    reference: 'JOB-2026-0101', lines: 3, totalExGst: 181.83, gst: 18.18,
    status: 'Billed',
  },
  {
    id: 'po6', poNumber: 'PO-4555', date: '2026-03-08',
    supplier: 'Repco', supplierCode: 'REPCO',
    reference: 'JOB-2026-0128', lines: 1, totalExGst: 197.00, gst: 19.70,
    status: 'Received',
  },
  {
    id: 'po7', poNumber: 'PO-4572', date: '2026-03-18',
    supplier: '24/7 Access Pty Ltd', supplierCode: '247',
    reference: 'JOB-2026-0143', lines: 2, totalExGst: 57.97, gst: 5.80,
    status: 'Draft',
  },
];

function StatusChip({ status }: { status: PoStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Chip label={status} size="small" icon={cfg.icon as any}
      sx={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.68rem',
        border: `1px solid ${cfg.color}20`, '& .MuiChip-icon': { color: `${cfg.color} !important` } }} />
  );
}

const SUPPLIER_AVATARS: Record<string, string> = {
  JAS: '#2e7d32', APD: '#1565c0', REPCO: '#b71c1c', '247': '#e65100',
};

export const POListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = PURCHASE_ORDERS.filter(po =>
    po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    po.supplier.toLowerCase().includes(search.toLowerCase()) ||
    po.reference.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = PURCHASE_ORDERS.reduce((s, p) => s + p.totalExGst + p.gst, 0);
  const drafted = PURCHASE_ORDERS.filter(p => p.status === 'Draft').length;
  const pending = PURCHASE_ORDERS.filter(p => ['Sent', 'Partially Received'].includes(p.status)).length;
  const complete = PURCHASE_ORDERS.filter(p => ['Received', 'Billed'].includes(p.status)).length;

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: FI_PURPLE }}>Purchase Orders</Typography>
          <Typography variant="body2" color="text.secondary">Kingy's Diesel Industries</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="small"
          sx={{ backgroundColor: FI_ORANGE, textTransform: 'none' }}>
          + New Purchase Order
        </Button>
      </Stack>

      {/* Summary cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        {[
          { label: 'Total PO Value', value: `$${totalValue.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`, color: FI_PURPLE, bg: '#f5f0ff' },
          { label: 'Draft',          value: drafted,  color: '#666',    bg: '#f5f5f5' },
          { label: 'In Progress',    value: pending,  color: '#e65100', bg: '#fff3e0' },
          { label: 'Complete',       value: complete, color: '#1b5e20', bg: '#e8f5e9' },
        ].map(card => (
          <Paper key={card.label} sx={{ flex: 1, p: 1.5, border: `1px solid ${card.color}30`, backgroundColor: card.bg }}>
            <Typography variant="h5" fontWeight={800} sx={{ color: card.color }}>{card.value}</Typography>
            <Typography variant="caption" sx={{ color: card.color, fontWeight: 600 }}>{card.label}</Typography>
          </Paper>
        ))}
      </Stack>

      {/* Search */}
      <Box mb={2}>
        <TextField size="small" placeholder="Search POs, suppliers, references..."
          value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ width: 340 }} />
      </Box>

      {/* Table */}
      <Paper sx={{ border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f0ff' }}>
              {['PO Number', 'Date', 'Supplier', 'Reference', 'Lines', 'Ex GST', 'GST', 'Total', 'Status', ''].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: FI_PURPLE }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(po => (
              <TableRow key={po.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/po-print/${po.id}`)}>
                <TableCell>
                  <Typography variant="caption" sx={{ color: FI_ORANGE, fontWeight: 700 }}>{po.poNumber}</Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(po.date).toLocaleDateString('en-AU')}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <Avatar sx={{ width: 22, height: 22, fontSize: '0.55rem', fontWeight: 800,
                      backgroundColor: SUPPLIER_AVATARS[po.supplierCode] || '#555' }}>
                      {po.supplierCode.slice(0, 3)}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', maxWidth: 160 }} noWrap>{po.supplier}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: FI_BLUE }}>{po.reference}</TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{po.lines}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>${po.totalExGst.toFixed(2)}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>${po.gst.toFixed(2)}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  ${(po.totalExGst + po.gst).toFixed(2)}
                </TableCell>
                <TableCell><StatusChip status={po.status} /></TableCell>
                <TableCell>
                  <Tooltip title="Print Preview">
                    <Button size="small" variant="outlined" startIcon={<PrintIcon />}
                      sx={{ textTransform: 'none', fontSize: '0.68rem', borderColor: FI_PURPLE, color: FI_PURPLE }}
                      onClick={e => { e.stopPropagation(); navigate(`/po-print/${po.id}`); }}>
                      Print
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ px: 2, py: 1, borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
          <Typography variant="caption" color="text.secondary">{filtered.length} purchase orders</Typography>
        </Box>
      </Paper>
    </Box>
  );
};
