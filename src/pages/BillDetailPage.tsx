import React, { useState, useRef, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, Checkbox, FormControlLabel, Alert,
  Divider, CircularProgress, Tooltip, Stack, LinearProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WorkIcon from '@mui/icons-material/Work';
import LinkIcon from '@mui/icons-material/Link';
import PrintIcon from '@mui/icons-material/Print';
import { useParams, useNavigate } from 'react-router-dom';
import { BILLS, BILL_LINE_ITEMS, SUPPLIERS, BillLineItem } from '../data/mockData';

const FI_PURPLE = '#674EA7';
const FI_ORANGE = '#F57C00';

const fmt = (n: number) => `$${n.toFixed(2)}`;

const PROCESSING_STEPS = [
  'Reading PDF structure…',
  'Extracting line items…',
  'Matching supplier codes to internal inventory…',
  'Detecting GST treatment per line…',
  'Calculating totals…',
  'Complete.',
];

const CodeMatchBadge: React.FC<{ match: BillLineItem['codeMatch'] }> = ({ match }) => {
  if (match === 'exact')   return <Chip icon={<CheckCircleIcon />} label="Exact match" size="small" color="success" sx={{ fontSize: '0.62rem', height: 18, '& .MuiChip-icon': { fontSize: 12 } }} />;
  if (match === 'partial') return <Chip icon={<WarningAmberIcon />} label="Partial" size="small" color="warning" sx={{ fontSize: '0.62rem', height: 18, '& .MuiChip-icon': { fontSize: 12 } }} />;
  return <Chip icon={<HelpOutlineIcon />} label="No match" size="small" color="error" sx={{ fontSize: '0.62rem', height: 18, '& .MuiChip-icon': { fontSize: 12 } }} />;
};

const GstBadge: React.FC<{ treatment: 'ex' | 'inc' }> = ({ treatment }) => (
  <Chip
    label={treatment === 'ex' ? 'Ex GST' : 'Inc GST'}
    size="small"
    sx={{
      fontSize: '0.62rem', height: 18, fontWeight: 700,
      backgroundColor: treatment === 'ex' ? '#e8f5e9' : '#fff3e0',
      color: treatment === 'ex' ? '#2e7d32' : '#e65100',
    }}
  />
);

export const BillDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bill = BILLS.find(b => b.id === id);
  const supplier = bill ? SUPPLIERS.find(s => s.id === bill.supplierId) : null;

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [processed, setProcessed] = useState(bill?.processed ?? false);
  const [copyToPo, setCopyToPo]   = useState(false);
  const [copyToJob, setCopyToJob] = useState(false);
  const [copied, setCopied]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lineItems: BillLineItem[] = (bill && BILL_LINE_ITEMS[bill.id]) ? BILL_LINE_ITEMS[bill.id] : [];

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') setUploadedFile(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleProcess = () => {
    setProcessing(true);
    setProcessStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProcessStep(step);
      if (step >= PROCESSING_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setProcessing(false);
          setProcessed(true);
        }, 400);
      }
    }, 500);
  };

  const handleApply = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!bill) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Bill not found.</Alert>
        <Button onClick={() => navigate('/bills')} sx={{ mt: 2 }}>Back to Bills</Button>
      </Box>
    );
  }

  const subTotal = lineItems.reduce((s, l) => s + l.lineTotal, 0);
  const totalGst = lineItems.reduce((s, l) => s + l.gstAmount, 0);
  const totalInc = subTotal + totalGst;

  return (
    <Box>
      {/* Toolbar */}
      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/bills')}
          sx={{ textTransform: 'none', color: '#555', fontSize: '0.8rem' }}>
          Back to Bills
        </Button>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ textTransform: 'none', fontSize: '0.75rem', borderColor: FI_PURPLE, color: FI_PURPLE }}>
            Print
          </Button>
          {processed && (
            <Button variant="contained"
              sx={{ textTransform: 'none', fontSize: '0.75rem', backgroundColor: '#2e7d32' }}>
              Approve Bill
            </Button>
          )}
        </Stack>
      </Box>

      {/* Bill document */}
      <Paper elevation={1} sx={{ maxWidth: 940, mx: 'auto', p: 4, border: '1px solid #e0e0e0' }} id="bill-print-area">

        {/* Letterhead */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: FI_PURPLE }}>SUPPLIER BILL</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#888', mt: 0.3 }}>Kingy's Diesel Industries</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#aaa' }}>ABN 12 345 678 901</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Box sx={{ display: 'inline-block', backgroundColor: '#f5f0ff', px: 2, py: 1, borderRadius: 1, mb: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: FI_PURPLE }}>{bill.billNo}</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.72rem', color: '#666' }}>Date: {bill.date}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {/* Meta grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', mb: 0.5 }}>Supplier</Typography>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{supplier?.name}</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#888' }}>Terms: {supplier?.terms}</Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#888' }}>{supplier?.email}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', mb: 0.5 }}>Supplier Invoice #</Typography>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{bill.supplierInvoiceNo}</Typography>
            {bill.linkedPoId && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <LinkIcon sx={{ fontSize: 13, color: '#027BFF' }} />
                <Typography sx={{ fontSize: '0.72rem', color: '#027BFF', fontWeight: 600 }}>
                  Linked to {bill.linkedPoId}
                </Typography>
              </Box>
            )}
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', mb: 0.5 }}>Job Reference</Typography>
            {bill.jobRef ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <WorkIcon sx={{ fontSize: 15, color: FI_ORANGE }} />
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: FI_ORANGE }}>{bill.jobRef}</Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: '0.82rem', color: '#bbb' }}>No job linked</Typography>
            )}
            <Chip
              label={bill.status}
              size="small"
              color={bill.status === 'Paid' ? 'success' : bill.status === 'Disputed' ? 'error' : bill.status === 'Approved' ? 'primary' : 'default'}
              sx={{ mt: 0.8, fontSize: '0.65rem', fontWeight: 700, height: 20 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* PDF Upload zone */}
        {!processed && (
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#444', mb: 1.5 }}>
              Upload Supplier Invoice PDF
            </Typography>

            {/* Drop zone */}
            <Box
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${isDragging ? FI_PURPLE : uploadedFile ? '#2e7d32' : '#ccc'}`,
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? '#f5f0ff' : uploadedFile ? '#f1f8e9' : '#fafafa',
                transition: 'all 0.2s',
                '&:hover': { borderColor: FI_PURPLE, backgroundColor: '#f5f0ff' },
              }}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
              <UploadFileIcon sx={{ fontSize: 40, color: uploadedFile ? '#2e7d32' : '#ccc', mb: 1 }} />
              {uploadedFile ? (
                <>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#2e7d32' }}>
                    {uploadedFile.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#888', mt: 0.5 }}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB · Click to replace
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>
                    Drag & drop supplier invoice PDF here
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', color: '#aaa', mt: 0.5 }}>
                    or click to browse · PDF files only
                  </Typography>
                </>
              )}
            </Box>

            {/* PROCESS button */}
            {(uploadedFile || bill.pdfUploaded) && !processing && (
              <Box sx={{ textAlign: 'center', mt: 2.5 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AutoFixHighIcon />}
                  onClick={handleProcess}
                  sx={{
                    backgroundColor: FI_PURPLE,
                    textTransform: 'none',
                    fontWeight: 800,
                    fontSize: '1rem',
                    px: 5,
                    py: 1.2,
                    borderRadius: 2,
                    boxShadow: `0 4px 14px ${FI_PURPLE}55`,
                    '&:hover': { backgroundColor: '#4a3580', boxShadow: `0 6px 20px ${FI_PURPLE}77` },
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: `0 4px 14px ${FI_PURPLE}55` },
                      '50%': { boxShadow: `0 4px 24px ${FI_PURPLE}99` },
                      '100%': { boxShadow: `0 4px 14px ${FI_PURPLE}55` },
                    },
                  }}
                >
                  ✨ PROCESS PDF
                </Button>
                <Typography sx={{ fontSize: '0.7rem', color: '#aaa', mt: 0.8 }}>
                  Alfred will read the PDF and extract all line items, codes, and GST details
                </Typography>
              </Box>
            )}

            {/* No PDF but bill.pdfUploaded from mock */}
            {!uploadedFile && bill.pdfUploaded && !processing && (
              <Box sx={{ mt: 1.5, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.72rem', color: '#888' }}>
                  PDF already uploaded · Click PROCESS PDF to extract line items
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Processing animation */}
        {processing && (
          <Box sx={{ mb: 3, p: 3, backgroundColor: '#f5f0ff', borderRadius: 2, border: `1px solid ${FI_PURPLE}33` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <CircularProgress size={20} sx={{ color: FI_PURPLE }} />
              <Typography sx={{ fontWeight: 700, color: FI_PURPLE, fontSize: '0.9rem' }}>
                Alfred is reading your PDF…
              </Typography>
            </Box>
            <LinearProgress variant="determinate"
              value={(processStep / (PROCESSING_STEPS.length - 1)) * 100}
              sx={{ mb: 1.5, borderRadius: 1, height: 6, backgroundColor: '#e0d5f5',
                '& .MuiLinearProgress-bar': { backgroundColor: FI_PURPLE } }} />
            {PROCESSING_STEPS.slice(0, processStep + 1).map((step, i) => (
              <Typography key={i} sx={{
                fontSize: '0.72rem',
                color: i === processStep ? FI_PURPLE : '#888',
                fontWeight: i === processStep ? 700 : 400,
                mb: 0.3,
              }}>
                {i < processStep ? '✓ ' : '→ '}{step}
              </Typography>
            ))}
          </Box>
        )}

        {/* Processed results */}
        {processed && lineItems.length > 0 && (
          <Box>
            {/* Action checkboxes */}
            <Paper elevation={0} sx={{
              p: 2, mb: 2.5,
              border: `2px solid ${FI_PURPLE}33`,
              backgroundColor: '#f9f5ff',
              borderRadius: 2,
            }}>
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: FI_PURPLE, mb: 1.2 }}>
                ✨ PDF processed — {lineItems.length} line items extracted. What would you like to do?
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={copyToPo}
                      onChange={e => setCopyToPo(e.target.checked)}
                      sx={{ color: FI_PURPLE, '&.Mui-checked': { color: FI_PURPLE }, py: 0.3 }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                      <ContentCopyIcon sx={{ fontSize: 15, color: FI_PURPLE }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        Copy line items to PO
                        {bill.linkedPoId && (
                          <Typography component="span" sx={{ fontSize: '0.72rem', color: '#027BFF', ml: 0.7 }}>
                            ({bill.linkedPoId})
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={copyToJob}
                      onChange={e => setCopyToJob(e.target.checked)}
                      sx={{ color: FI_ORANGE, '&.Mui-checked': { color: FI_ORANGE }, py: 0.3 }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                      <WorkIcon sx={{ fontSize: 15, color: FI_ORANGE }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        Copy line items to Job
                        {bill.jobRef && (
                          <Typography component="span" sx={{ fontSize: '0.72rem', color: FI_ORANGE, ml: 0.7, fontWeight: 700 }}>
                            ({bill.jobRef})
                          </Typography>
                        )}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
              {(copyToPo || copyToJob) && (
                <Box sx={{ mt: 1.5 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleApply}
                    sx={{ backgroundColor: FI_PURPLE, textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}
                  >
                    {copied ? '✓ Applied!' : 'Apply'}
                  </Button>
                  {copied && (
                    <Typography component="span" sx={{ ml: 1.5, fontSize: '0.72rem', color: '#2e7d32', fontWeight: 600 }}>
                      Line items copied successfully
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>

            {/* Line items table */}
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#444', mb: 1 }}>
              Extracted Line Items
            </Typography>
            <Table size="small" sx={{ mb: 3 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: FI_PURPLE }}>
                  {['#', 'Supplier Code', 'Internal Code', 'Match', 'Description', 'Qty', 'Unit Price', 'GST', 'GST Amt', 'Line Total (Ex)'].map(h => (
                    <TableCell key={h} sx={{ color: '#fff', fontWeight: 700, fontSize: '0.68rem', py: 1 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {lineItems.map((line, idx) => (
                  <TableRow key={line.id} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <TableCell sx={{ fontSize: '0.72rem', color: '#888' }}>{idx + 1}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 600, color: '#333' }}>
                        {line.supplierCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {line.internalCode ? (
                        <Typography sx={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 600, color: FI_PURPLE }}>
                          {line.internalCode}
                        </Typography>
                      ) : (
                        <Tooltip title="Code not found in your inventory — review required">
                          <Typography sx={{ fontSize: '0.72rem', color: '#e53935', fontStyle: 'italic' }}>
                            Not found
                          </Typography>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell><CodeMatchBadge match={line.codeMatch} /></TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', maxWidth: 180 }}>{line.description}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', textAlign: 'center', fontWeight: 600 }}>{line.qty}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right' }}>{fmt(line.unitPrice)}</TableCell>
                    <TableCell><GstBadge treatment={line.gstTreatment} /></TableCell>
                    <TableCell sx={{ fontSize: '0.72rem', textAlign: 'right', color: '#888' }}>{fmt(line.gstAmount)}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', textAlign: 'right', fontWeight: 700 }}>{fmt(line.lineTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Unmatched warning */}
            {lineItems.some(l => l.codeMatch === 'none') && (
              <Alert severity="warning" sx={{ mb: 2, fontSize: '0.75rem' }}>
                {lineItems.filter(l => l.codeMatch === 'none').length} line item(s) have no matching internal inventory code — please review and map manually before approving.
              </Alert>
            )}
          </Box>
        )}

        {/* Totals */}
        {processed && lineItems.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Box sx={{ width: 280 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Subtotal (Ex GST)</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{fmt(subTotal)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>GST (10%)</Typography>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{fmt(totalGst)}</Typography>
              </Box>
              <Divider sx={{ my: 0.8 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, backgroundColor: '#f5f0ff', px: 1, borderRadius: 1 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: FI_PURPLE }}>Total (Inc GST)</Typography>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: FI_PURPLE }}>{fmt(totalInc)}</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: '0.65rem', color: '#aaa' }}>
                  * Prices shown Ex GST. Lines marked "Inc GST" have been normalised to Ex GST for totalling.
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Notes */}
        {bill.notes && (
          <Alert severity="info" sx={{ fontSize: '0.75rem', mt: 1 }}>{bill.notes}</Alert>
        )}

        {/* Footer */}
        <Divider sx={{ mt: 3, mb: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '0.65rem', color: '#bbb' }}>
            Kingy's Diesel Industries · Supplier Price Books Prototype
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: '#bbb' }}>
            v0.4.0 · Built by Alfred
          </Typography>
        </Box>
      </Paper>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          #bill-print-area { box-shadow: none !important; border: none !important; margin: 0 !important; max-width: 100% !important; }
          body { margin: 0; }
        }
      `}</style>
    </Box>
  );
};
