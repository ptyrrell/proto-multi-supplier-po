// Kingy's Diesel Industries — mock data matching real FieldInsight screenshots

export type GstTreatment = 'ex' | 'inc';
export type BillStatus = 'Draft' | 'Approved' | 'Paid' | 'Disputed';

export interface BillLineItem {
  id: number;
  supplierCode: string;
  internalCode: string;
  codeMatch: 'exact' | 'partial' | 'none';
  description: string;
  qty: number;
  unitPrice: number;
  gstTreatment: GstTreatment;
  gstAmount: number;
  lineTotal: number; // always ex GST
}

export interface Bill {
  id: string;
  billNo: string;
  date: string;
  supplierId: string;
  supplierInvoiceNo: string;
  linkedPoId: string | null;
  jobRef: string;
  status: BillStatus;
  pdfUploaded: boolean;
  processed: boolean;
  subtotalExGst: number;
  totalGst: number;
  totalIncGst: number;
  notes: string;
}

export const SUPPLIERS = [
  { id: 'sup1', code: 'JAS',   name: 'JAS Oceania Pty Ltd',          terms: '30 Days EOM', email: 'accounts@jasoceania.com.au' },
  { id: 'sup2', code: 'APD',   name: 'Auto Parts Distribution (NEW)', terms: '30 Days EOM', email: 'accounts@apdist.com.au' },
  { id: 'sup3', code: 'REPCO', name: 'Repco',                         terms: '14 Days',     email: 'trade@repco.com.au' },
  { id: 'sup4', code: '247',   name: '24/7 Access Pty Ltd',           terms: '14 Days',     email: 'dave@24-7access.com.au' },
];

export const PRODUCTS = [
  { id: 1, code: 'WA5364',       description: 'Air filter',                    category: 'Filter',    primarySupplier: 'sup2', purchasePrice: 25.74, markup: 65, stock: 0, minStock: 0 },
  { id: 2, code: 'WACF0215',     description: 'Cabin Filter',                  category: 'Filter',    primarySupplier: 'sup2', purchasePrice: 7.25,  markup: 65, stock: 0, minStock: 0 },
  { id: 3, code: 'WZ418NM',      description: 'Oil Filter',                    category: 'Filter',    primarySupplier: 'sup2', purchasePrice: 7.47,  markup: 65, stock: 0, minStock: 0 },
  { id: 4, code: 'WCF82',        description: 'Fuel Filter',                   category: 'Filter',    primarySupplier: 'sup2', purchasePrice: 18.60, markup: 65, stock: 0, minStock: 0 },
  { id: 5, code: 'N70ZZMFC-E',   description: '12V 810CCA 165RC CRANK FLD',   category: 'Electrical',primarySupplier: 'sup1', purchasePrice: 165.30,markup: 40, stock: 1, minStock: 1 },
  { id: 6, code: '0045450426',   description: 'ECU Housing Mac 25 (MERC Engine)',category:'Electrical',primarySupplier: 'sup3', purchasePrice: 197.00,markup: 65, stock: 0, minStock: 0 },
  { id: 7, code: '007303AA',     description: 'Circlip',                       category: 'Hardware',  primarySupplier: 'sup3', purchasePrice: 0.00,  markup: 65, stock: 1, minStock: 2 },
  { id: 8, code: '026611',       description: 'Hydraulic Filter',              category: 'Filter',    primarySupplier: 'sup4', purchasePrice: 57.97, markup: 65, stock: 1, minStock: 0 },
];

// Per-supplier pricing for each product
export const PRICE_BOOKS: Record<string, Record<string, number>> = {
  sup1: { WA5364: 28.40, WACF0215: 8.10, WZ418NM: 8.20, WCF82: 19.80, 'N70ZZMFC-E': 165.30 },
  sup2: { WA5364: 25.74, WACF0215: 7.25, WZ418NM: 7.47, WCF82: 18.60, 'N70ZZMFC-E': 172.00 },
  sup3: { WA5364: 27.50, WACF0215: 7.80, WZ418NM: 7.90, WCF82: 20.10 },
  sup4: { WA5364: 26.20, WACF0215: 7.50, WZ418NM: 7.60, WCF82: 19.20 },
};

export const PO_LINES = [
  { id: 1, inventoryCode: 'WA5364',     description: 'Air filter',   qty: 1, supplierId: 'sup2', jobType: 'General Service', category: '' },
  { id: 2, inventoryCode: 'WACF0215',   description: 'Cabin Filter', qty: 1, supplierId: 'sup2', jobType: 'General Service', category: '' },
  { id: 3, inventoryCode: 'WZ418NM',    description: 'Oil Filter',   qty: 1, supplierId: 'sup2', jobType: 'General Service', category: '' },
  { id: 4, inventoryCode: 'WCF82',      description: 'Fuel Filter',  qty: 1, supplierId: 'sup2', jobType: 'General Service', category: '' },
];

export const BILL_DIFF_DATA = [
  { billId: 'BILL-2026-001', billDate: '2026-02-26', supplier: 'JAS Oceania Pty Ltd',          billNo: 'INV-5879691', billAmount: 181.83, paidAmount: 181.83, status: 'Paid',     poNo: 'PO-4560', poDate: '2026-02-25', poAmount: 181.83, received: 181.83, variance: 0,      varPct: 0,    match: 'Matched' },
  { billId: 'BILL-2026-002', billDate: '2026-03-18', supplier: 'Auto Parts Distribution (NEW)', billNo: 'APD-38KINGYS', billAmount: 64.97, paidAmount: null,   status: 'Approved', poNo: 'PO-4571', poDate: '2026-03-18', poAmount: 64.97,  received: 59.06, variance: 0,      varPct: 0,    match: 'Matched' },
  { billId: 'BILL-2026-003', billDate: '2026-03-10', supplier: 'Repco',                        billNo: 'RP-109234',   billAmount: 312.50, paidAmount: null,   status: 'Approved', poNo: 'PO-4555', poDate: '2026-03-08', poAmount: 290.00, received: 290.00,variance: 22.50,  varPct: 7.8,  match: 'Over' },
  { billId: 'BILL-2026-004', billDate: '2026-03-05', supplier: '24/7 Access Pty Ltd',          billNo: '247-88213',   billAmount: 88.00,  paidAmount: null,   status: 'Draft',    poNo: '',        poDate: '',           poAmount: 0,      received: 0,     variance: 88.00,  varPct: 100,  match: 'Unmatched' },
];

// ── Purchase Orders (extended with Job references) ────────────────────────────
export const PURCHASE_ORDERS = [
  { id: 'PO-4571', date: '2026-03-18', supplierId: 'sup2', jobRef: 'Job #247', reference: 'APD-38KINGYS',  lines: 4, exGst: 59.06, gst: 5.91,  total: 64.97,  status: 'Sent' },
  { id: 'PO-4560', date: '2026-02-25', supplierId: 'sup1', jobRef: 'Job #234', reference: 'INV-5879691',   lines: 3, exGst: 165.30,gst: 16.53, total: 181.83, status: 'Received' },
  { id: 'PO-4555', date: '2026-03-08', supplierId: 'sup3', jobRef: 'Job #241', reference: 'RP-109234',     lines: 2, exGst: 264.00,gst: 26.40, total: 290.40, status: 'Sent' },
  { id: 'PO-4549', date: '2026-03-01', supplierId: 'sup4', jobRef: 'Job #239', reference: 'KD-MISC-0301',  lines: 1, exGst: 80.00, gst: 8.00,  total: 88.00,  status: 'Draft' },
  { id: 'PO-4530', date: '2026-02-10', supplierId: 'sup1', jobRef: 'Job #228', reference: 'KD-STOCK-0210', lines: 6, exGst: 312.45,gst: 31.25, total: 343.70, status: 'Billed' },
];

// ── Bills (Supplier Invoices) ─────────────────────────────────────────────────
export const BILLS: Bill[] = [
  {
    id: 'BILL-001', billNo: 'BILL-2026-001', date: '2026-03-18', supplierId: 'sup2',
    supplierInvoiceNo: 'APD-38KINGYS', linkedPoId: 'PO-4571', jobRef: 'Job #247',
    status: 'Approved', pdfUploaded: true, processed: true,
    subtotalExGst: 59.06, totalGst: 5.91, totalIncGst: 64.97, notes: '',
  },
  {
    id: 'BILL-002', billNo: 'BILL-2026-002', date: '2026-02-26', supplierId: 'sup1',
    supplierInvoiceNo: 'INV-5879691', linkedPoId: 'PO-4560', jobRef: 'Job #234',
    status: 'Paid', pdfUploaded: true, processed: true,
    subtotalExGst: 165.30, totalGst: 16.53, totalIncGst: 181.83, notes: '',
  },
  {
    id: 'BILL-003', billNo: 'BILL-2026-003', date: '2026-03-10', supplierId: 'sup3',
    supplierInvoiceNo: 'RP-109234', linkedPoId: 'PO-4555', jobRef: 'Job #241',
    status: 'Disputed', pdfUploaded: true, processed: true,
    subtotalExGst: 284.09, totalGst: 28.41, totalIncGst: 312.50, notes: 'Line 2 price variance — awaiting credit note from Repco',
  },
  {
    id: 'BILL-004', billNo: 'BILL-2026-004', date: '2026-03-19', supplierId: 'sup4',
    supplierInvoiceNo: '247-88213', linkedPoId: null, jobRef: '',
    status: 'Draft', pdfUploaded: false, processed: false,
    subtotalExGst: 80.00, totalGst: 8.00, totalIncGst: 88.00, notes: 'No PO linked — standalone purchase',
  },
];

// ── Processed Bill Line Items (result of PDF "OCR" processing) ────────────────
// Keyed by Bill ID. Simulates what Alfred extracts from the supplier PDF.
export const BILL_LINE_ITEMS: Record<string, BillLineItem[]> = {
  'BILL-001': [
    { id: 1, supplierCode: 'APD-WA5364',    internalCode: 'WA5364',    codeMatch: 'exact',   description: 'Air Filter — Heavy Duty Diesel',    qty: 2, unitPrice: 12.87, gstTreatment: 'ex',  gstAmount: 2.57,  lineTotal: 25.74 },
    { id: 2, supplierCode: 'APD-WACF0215',  internalCode: 'WACF0215',  codeMatch: 'exact',   description: 'Cabin Air Filter',                  qty: 1, unitPrice: 7.25,  gstTreatment: 'ex',  gstAmount: 0.73,  lineTotal: 7.25  },
    { id: 3, supplierCode: 'APD-WZ418NM',   internalCode: 'WZ418NM',   codeMatch: 'exact',   description: 'Oil Filter — Spin On',               qty: 3, unitPrice: 7.47,  gstTreatment: 'ex',  gstAmount: 2.24,  lineTotal: 22.41 },
    { id: 4, supplierCode: 'APD-5W30SYN5L', internalCode: 'SYNTH-5W30',codeMatch: 'none',    description: 'Engine Oil 5W-30 Full Synthetic 5L', qty: 1, unitPrice: 3.66,  gstTreatment: 'inc', gstAmount: 0.33,  lineTotal: 3.66  },
  ],
  'BILL-002': [
    { id: 1, supplierCode: 'JAS-N70ZZMFC',  internalCode: 'N70ZZMFC-E',codeMatch: 'exact',   description: '12V 810CCA Battery — Crank FLD',     qty: 1, unitPrice: 165.30,gstTreatment: 'ex',  gstAmount: 16.53, lineTotal: 165.30},
  ],
  'BILL-003': [
    { id: 1, supplierCode: 'RP-0045450426', internalCode: '0045450426', codeMatch: 'exact',   description: 'ECU Housing Mac 25 (MERC Engine)',   qty: 1, unitPrice: 197.00,gstTreatment: 'ex',  gstAmount: 19.70, lineTotal: 197.00},
    { id: 2, supplierCode: 'RP-CF85D',      internalCode: 'WCF82',      codeMatch: 'partial', description: 'Fuel Filter — Diesel (Repco SKU)',   qty: 1, unitPrice: 87.09, gstTreatment: 'inc', gstAmount: 7.92,  lineTotal: 79.17 },
    { id: 3, supplierCode: 'RP-007303AA',   internalCode: '007303AA',   codeMatch: 'exact',   description: 'Circlip — Internal 35mm',            qty: 4, unitPrice: 1.98,  gstTreatment: 'ex',  gstAmount: 0.79,  lineTotal: 7.92  },
  ],
};
