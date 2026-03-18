import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, Stack, LinearProgress
} from '@mui/material';
import { BILL_DIFF_DATA } from '../data/mockData';

const FI_PURPLE = '#674EA7';
const FI_ORANGE = '#F57C00';

const matchColor: Record<string, any> = {
  Matched:   { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  Partial:   { backgroundColor: '#fff9c4', color: '#f57f17' },
  Unmatched: { backgroundColor: '#fce4ec', color: '#c62828' },
  Over:      { backgroundColor: '#fff3e0', color: '#e65100' },
};

export const BillDiffPage: React.FC = () => {
  const totalBills    = BILL_DIFF_DATA.length;
  const totalBillAmt  = BILL_DIFF_DATA.reduce((s, r) => s + r.billAmount, 0);
  const totalPoAmt    = BILL_DIFF_DATA.reduce((s, r) => s + r.poAmount, 0);
  const totalVariance = BILL_DIFF_DATA.reduce((s, r) => s + r.variance, 0);
  const matched       = BILL_DIFF_DATA.filter(r => r.match === 'Matched').length;
  const matchRate     = Math.round((matched / totalBills) * 100);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ color: FI_PURPLE, mb: 0.5 }}>Bill Difference Report</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>Compare bills against purchase orders</Typography>

      {/* Summary cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        {[
          { label: 'Total Bills',    value: totalBills.toString(), sub: `${matched} matched`, color: FI_PURPLE },
          { label: 'Total Bill Amt', value: `$${totalBillAmt.toFixed(2)}`, sub: `vs PO: $${totalPoAmt.toFixed(2)}`, color: FI_BLUE },
          { label: 'Total Variance', value: `$${totalVariance.toFixed(2)}`, sub: totalVariance > 0 ? 'Over billed' : 'Under billed', color: totalVariance > 0 ? FI_ORANGE : '#2e7d32' },
          { label: 'Match Rate',     value: `${matchRate}%`, sub: `${matched} exact matches`, color: matchRate >= 80 ? '#2e7d32' : FI_ORANGE },
        ].map(c => (
          <Paper key={c.label} sx={{ flex: 1, p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary">{c.label}</Typography>
            <Typography variant="h5" fontWeight={800} sx={{ color: c.color }}>{c.value}</Typography>
            <Typography variant="caption" color="text.secondary">{c.sub}</Typography>
            {c.label === 'Match Rate' && (
              <LinearProgress variant="determinate" value={matchRate}
                sx={{ mt: 1, height: 6, borderRadius: 3, backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { backgroundColor: c.color } }} />
            )}
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ border: '1px solid #e0e0e0', overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f0ff' }}>
              <TableCell colSpan={6} sx={{ fontWeight: 700, fontSize: '0.72rem', color: FI_PURPLE, borderRight: '2px solid #e0e0e0' }}>
                Bill Information (Sales → Bills)
              </TableCell>
              <TableCell colSpan={4} sx={{ fontWeight: 700, fontSize: '0.72rem', color: '#2e7d32', borderRight: '2px solid #e0e0e0' }}>
                PO Information (Sales → PO)
              </TableCell>
              <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: '0.72rem', color: FI_ORANGE }}>
                Variance Analysis
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              {['Bill ID','Date','Supplier','Bill #','Amount','Status','PO #','PO Date','PO Amount','Received','Variance $','Var %','Match'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {BILL_DIFF_DATA.map(row => (
              <TableRow key={row.billId} hover>
                <TableCell><Typography variant="caption" sx={{ color: FI_ORANGE, fontWeight: 700 }}>{row.billId}</Typography></TableCell>
                <TableCell sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{row.billDate}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.supplier}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{row.billNo}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>${row.billAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip label={row.status} size="small"
                    color={row.status === 'Paid' ? 'success' : row.status === 'Approved' ? 'info' : 'default'}
                    sx={{ fontSize: '0.65rem' }} />
                </TableCell>
                <TableCell><Typography variant="caption" sx={{ color: FI_ORANGE }}>{row.poNo || '—'}</Typography></TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.poDate || '—'}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.poAmount > 0 ? `$${row.poAmount.toFixed(2)}` : '—'}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{row.received > 0 ? `$${row.received.toFixed(2)}` : '—'}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem', fontWeight: row.variance > 0 ? 700 : 400, color: row.variance > 0 ? FI_ORANGE : undefined }}>
                  {row.variance > 0 ? `$${row.variance.toFixed(2)}` : '—'}
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem', color: row.varPct > 5 ? FI_ORANGE : undefined }}>
                  {row.varPct > 0 ? `${row.varPct.toFixed(1)}%` : '—'}
                </TableCell>
                <TableCell>
                  <Chip label={row.match} size="small" sx={{ fontSize: '0.65rem', ...matchColor[row.match] }} />
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#f5f0ff' }}>
              <TableCell colSpan={4} sx={{ fontWeight: 800, fontSize: '0.78rem' }}>TOTAL</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem' }}>${totalBillAmt.toFixed(2)}</TableCell>
              <TableCell />
              <TableCell colSpan={2} />
              <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem' }}>${totalPoAmt.toFixed(2)}</TableCell>
              <TableCell />
              <TableCell sx={{ fontWeight: 800, fontSize: '0.78rem', color: FI_ORANGE }}>${totalVariance.toFixed(2)}</TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Legend */}
      <Stack direction="row" spacing={2} mt={1.5}>
        {Object.entries(matchColor).map(([label, style]) => (
          <Stack key={label} direction="row" spacing={0.5} alignItems="center">
            <Chip label={label} size="small" sx={{ fontSize: '0.65rem', ...style }} />
            <Typography variant="caption" color="text.secondary">
              {label === 'Matched' ? 'Bill = PO exactly' :
               label === 'Partial' ? 'Partial delivery/payment' :
               label === 'Unmatched' ? 'No PO found' : 'Bill exceeds PO'}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

const FI_BLUE = '#027BFF';