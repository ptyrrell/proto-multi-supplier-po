// Kingy's Diesel Industries — mock data matching real FieldInsight screenshots

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
