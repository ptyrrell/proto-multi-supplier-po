import React from 'react';
import {
  Box, Typography, Paper, Stack, Divider, Table,
  TableBody, TableCell, TableHead, TableRow, Button, Chip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate, useParams } from 'react-router-dom';

const FI_PURPLE = '#674EA7';
const FI_ORANGE = '#F57C00';

// Detailed PO line data per PO
const PO_DETAIL: Record<string, {
  poNumber: string;
  date: string;
  deliveryDate?: string;
  status: string;
  supplier: { name: string; address: string; phone: string; email: string; abn: string; };
  billTo: { name: string; address: string; abn: string; };
  reference: string;
  notes?: string;
  lines: { lineNo: number; code: string; description: string; qty: number; unitPrice: number; discount?: number; }[];
}> = {
  po1: {
    poNumber: 'PO-4571', date: '2026-03-18', deliveryDate: '2026-03-19', status: 'Received',
    supplier: {
      name: 'Auto Parts Distribution (NEW)',
      address: 'Unit 4, 22 Industrial Dr, Dandenong VIC 3175',
      phone: '03 9999 1234', email: 'accounts@apdist.com.au', abn: '44 123 456 789',
    },
    billTo: {
      name: "Kingy's Diesel Industries",
      address: '14 Diesel Way, Campbellfield VIC 3061',
      abn: '61 987 654 321',
    },
    reference: 'JOB-2026-0142',
    notes: 'Filters for 2022 Isuzu NPR — urgent delivery required by 19 Mar.',
    lines: [
      { lineNo: 1, code: 'WA5364',   description: 'Air filter',                    qty: 1, unitPrice: 25.74 },
      { lineNo: 2, code: 'WACF0215', description: 'Cabin Filter',                  qty: 1, unitPrice: 7.25 },
      { lineNo: 3, code: 'WZ418NM',  description: 'Oil Filter',                    qty: 1, unitPrice: 7.47 },
      { lineNo: 4, code: 'WCF82',    description: 'Fuel Filter',                   qty: 1, unitPrice: 18.60 },
    ],
  },
  po2: {
    poNumber: 'PO-4570', date: '2026-03-17', deliveryDate: '2026-03-20', status: 'Sent',
    supplier: {
      name: 'JAS Oceania Pty Ltd',
      address: '88 Freight Rd, Tullamarine VIC 3043',
      phone: '03 9338 5566', email: 'accounts@jasoceania.com.au', abn: '12 345 678 901',
    },
    billTo: {
      name: "Kingy's Diesel Industries",
      address: '14 Diesel Way, Campbellfield VIC 3061',
      abn: '61 987 654 321',
    },
    reference: 'JOB-2026-0139',
    lines: [
      { lineNo: 1, code: 'N70ZZMFC-E', description: '12V 810CCA 165RC CRANK FLD',    qty: 1, unitPrice: 165.30 },
      { lineNo: 2, code: '026611',     description: 'Hydraulic Filter',               qty: 1, unitPrice: 57.97, discount: 10 },
    ],
  },
  po7: {
    poNumber: 'PO-4572', date: '2026-03-18', status: 'Draft',
    supplier: {
      name: '24/7 Access Pty Ltd',
      address: '5 Access Blvd, Knoxfield VIC 3180',
      phone: '03 9765 4321', email: 'dave@24-7access.com.au', abn: '77 222 333 444',
    },
    billTo: {
      name: "Kingy's Diesel Industries",
      address: '14 Diesel Way, Campbellfield VIC 3061',
      abn: '61 987 654 321',
    },
    reference: 'JOB-2026-0143',
    lines: [
      { lineNo: 1, code: '026611',   description: 'Hydraulic Filter',  qty: 1, unitPrice: 57.97 },
      { lineNo: 2, code: '007303AA', description: 'Circlip',           qty: 5, unitPrice: 0.00 },
    ],
  },
};

// Fallback for POs without detailed data
const DEFAULT_PO_DETAIL = PO_DETAIL['po1'];

export const POPrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const po = (id && PO_DETAIL[id]) ? PO_DETAIL[id] : { ...DEFAULT_PO_DETAIL };

  const subtotal = po.lines.reduce((s, l) => {
    const disc = l.discount ? (l.unitPrice * l.qty * l.discount / 100) : 0;
    return s + (l.unitPrice * l.qty) - disc;
  }, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const handlePrint = () => window.print();

  return (
    <Box>
      {/* Screen-only toolbar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} className="no-print">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/purchase-orders-list')}
          sx={{ textTransform: 'none' }}>
          Back to PO List
        </Button>
        <Stack direction="row" spacing={1}>
          <Chip label={po.status} size="small"
            sx={{ backgroundColor: po.status === 'Received' ? '#e8f5e9' : po.status === 'Draft' ? '#f5f5f5' : '#e3f2fd',
              color: po.status === 'Received' ? '#1b5e20' : po.status === 'Draft' ? '#666' : '#1565c0',
              fontWeight: 700 }} />
          <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint}
            sx={{ backgroundColor: FI_PURPLE, textTransform: 'none' }}>
            Print / Save PDF
          </Button>
        </Stack>
      </Stack>

      {/* Print document */}
      <Paper sx={{ maxWidth: 860, mx: 'auto', p: 4, border: '1px solid #e0e0e0' }} id="print-area">

        {/* Letterhead */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight={900} sx={{ color: FI_PURPLE, letterSpacing: -0.5 }}>
              PURCHASE ORDER
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#333', mt: 0.5 }}>
              {po.poNumber}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#333' }}>
              Kingy's Diesel Industries
            </Typography>
            <Typography variant="body2" color="text.secondary">14 Diesel Way, Campbellfield VIC 3061</Typography>
            <Typography variant="body2" color="text.secondary">ABN: {po.billTo.abn}</Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* PO Meta */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={3}>
          <Box flex={1}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Supplier
            </Typography>
            <Typography variant="body2" fontWeight={700} mt={0.3}>{po.supplier.name}</Typography>
            <Typography variant="body2" color="text.secondary">{po.supplier.address}</Typography>
            <Typography variant="body2" color="text.secondary">{po.supplier.phone}</Typography>
            <Typography variant="body2" color="text.secondary">{po.supplier.email}</Typography>
            <Typography variant="body2" color="text.secondary">ABN: {po.supplier.abn}</Typography>
          </Box>
          <Box flex={1}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Delivery / Bill To
            </Typography>
            <Typography variant="body2" fontWeight={700} mt={0.3}>{po.billTo.name}</Typography>
            <Typography variant="body2" color="text.secondary">{po.billTo.address}</Typography>
          </Box>
          <Box flex={1}>
            <Stack spacing={0.6}>
              {[
                { label: 'PO Date',       value: new Date(po.date).toLocaleDateString('en-AU', { dateStyle: 'long' }) },
                { label: 'Delivery Date', value: po.deliveryDate ? new Date(po.deliveryDate).toLocaleDateString('en-AU', { dateStyle: 'long' }) : 'On request' },
                { label: 'Reference',     value: po.reference },
                { label: 'Status',        value: po.status },
              ].map(f => (
                <Stack key={f.label} direction="row" spacing={1}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 90 }}>{f.label}</Typography>
                  <Typography variant="caption" fontWeight={600}>{f.value}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>

        {po.notes && (
          <Box sx={{ backgroundColor: '#fffde7', p: 1.5, borderRadius: 1, mb: 2.5, border: '1px solid #ffe082' }}>
            <Typography variant="caption" fontWeight={700}>Notes: </Typography>
            <Typography variant="caption">{po.notes}</Typography>
          </Box>
        )}

        {/* Lines table */}
        <Table size="small" sx={{ mb: 3 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: FI_PURPLE }}>
              {['#', 'Code', 'Description', 'Qty', 'Unit Price', 'Discount', 'Line Total'].map(h => (
                <TableCell key={h} sx={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem', py: 1 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {po.lines.map(line => {
              const disc = line.discount ? (line.unitPrice * line.qty * line.discount / 100) : 0;
              const lineTotal = (line.unitPrice * line.qty) - disc;
              return (
                <TableRow key={line.lineNo} sx={{ '&:nth-of-type(even)': { backgroundColor: '#fafafa' } }}>
                  <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{line.lineNo}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: FI_ORANGE, fontWeight: 600 }}>{line.code}</TableCell>
                  <TableCell sx={{ fontSize: '0.78rem' }}>{line.description}</TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{line.qty}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem' }}>${line.unitPrice.toFixed(2)}</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', color: line.discount ? '#c62828' : 'text.secondary' }}>
                    {line.discount ? `-${line.discount}%` : '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>${lineTotal.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Totals */}
        <Stack direction="row" justifyContent="flex-end" mb={3}>
          <Box sx={{ minWidth: 260 }}>
            {[
              { label: 'Subtotal (ex GST)', value: `$${subtotal.toFixed(2)}`, bold: false },
              { label: 'GST (10%)',          value: `$${gst.toFixed(2)}`,      bold: false },
              { label: 'TOTAL (inc GST)',    value: `$${total.toFixed(2)}`,    bold: true },
            ].map(row => (
              <Stack key={row.label} direction="row" justifyContent="space-between"
                sx={{ py: 0.5, borderBottom: row.bold ? 'none' : '1px solid #f0f0f0',
                  borderTop: row.bold ? `2px solid ${FI_PURPLE}` : 'none', mt: row.bold ? 0.5 : 0 }}>
                <Typography variant="body2" fontWeight={row.bold ? 800 : 400}
                  sx={{ color: row.bold ? FI_PURPLE : undefined }}>{row.label}</Typography>
                <Typography variant="body2" fontWeight={row.bold ? 800 : 600}
                  sx={{ color: row.bold ? FI_PURPLE : undefined }}>{row.value}</Typography>
              </Stack>
            ))}
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Footer */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Please supply the goods/services listed above in accordance with our standard terms.
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Queries: accounts@kingydiesel.com.au · (03) 9000 0000
            </Typography>
          </Box>
          {po.status === 'Received' && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CheckCircleIcon sx={{ fontSize: 16, color: '#2e7d32' }} />
              <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 700 }}>Goods Received</Typography>
            </Stack>
          )}
        </Stack>

        <Box sx={{ mt: 3, pt: 1.5, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
            Supplier Price Books Prototype — v0.3.0 · Kingy's Diesel Industries · Built by Alfred
          </Typography>
        </Box>
      </Paper>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #print-area { box-shadow: none !important; border: none !important; max-width: 100% !important; margin: 0 !important; }
        }
      `}</style>
    </Box>
  );
};
