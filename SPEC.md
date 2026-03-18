# Supplier Price Books Prototype — Build Spec
## Client: Kingy's Diesel Industries

This document is Alfred's reference for building the prototype.
All reference images are in `reference-images/` folder.

---

## Reference Images (what was provided)

| File | What it shows |
|------|--------------|
| `image-9cad9de7...` | JAS Oceania TAX INVOICE 5879691 — real supplier bill format. Item N70ZZMFC-E, 12V 810CCA Battery, $165.30 ex GST, $181.83 total |
| `image-8e68f6e4...` | PO-4571 (Draft) header — real FieldInsight PO metadata screen. Supplier: Auto Parts Distribution (NEW), Site: Factory Pools Joel, Title: 071yyk factory pools, Status: Draft, 30 Days EOM, 18/03/2026 |
| `image-e89fc8da...` | PO-4571 Jobs & inventory tab — real PO line items. Primary Job 3701, 4 products: WA5364 Air filter $25.74, WACF0215 Cabin Filter $7.25, WZ418NM Oil Filter $7.47, WCF82 Fuel Filter $18.60. Total $59.06 ex, $64.97 inc GST |
| `image-abc8d5de...` | Edit Product dialog — Supplier Pricing tab showing empty table columns: Supplier Code, Supplier, Purchase $, Mark up %, Sales $, Tax |
| `image-5c63a6df...` | Products list page — full inventory with nav tabs across top: Services, Products, Additional charges, Subcontractor services, Packages, Stocktakes, Cost Centres, Cost Codes, Transactions |
| `image-d8b0df81...` | Bill Difference Report — from a Zoom demo call. Summary cards (Total Bills, Total Bill Amount, Total Variance, Match Rate), table showing Bill vs PO comparison |
| `image-823cd921...` | Products list with "Supplier Price Books" tab visible at end of nav — confirms this is the new tab to add |
| `image-28230b0e...` | PO printed document (Kingy's letterhead) — Purchase Order PO-4571, Kingy's Diesel Industries branding, supplier Auto Parts Distribution, 4 line items, subtotal $59.06, GST $5.91, Total $64.97 |
| `image-aa1e226e...` | Suppliers list — Account customers, Sites (customer), Contacts, Projects, Suppliers navigation |
| `image-e89fc8da...` | Edit Supplier 24/7 Access Pty Ltd — supplier detail form |

---

## Screens to Build

### 1. Purchase Orders List (`/purchase-orders-list`)
A list page showing all POs, matching real FieldInsight style.

**Columns:**
- PO # (orange link, e.g. PO-4571)
- Title
- Supplier
- Site
- Status (Draft / Submitted / Received) — coloured chip
- Total (ex GST)
- Date created
- Actions

**Mock data to show:**
- PO-4571 | 071yyk factory pools | Auto Parts Distribution (NEW) | Factory Pools | Draft | $59.06 | 18/03/2026
- PO-4570 | Battery replacement | JAS Oceania | Kingy's Workshop | Received | $181.83 | 26/02/2026
- PO-4565 | General service filters | Repco | Factory Pools | Submitted | $156.40 | 10/03/2026
- PO-4560 | Hydraulic parts | 24/7 Access | Workshop | Draft | $312.00 | 05/03/2026

**Toolbar:** + Create PO | Filter by supplier | Filter by status | Export

**Click PO # → goes to PO detail view (already built as `/purchase-orders`)**

---

### 2. PO Detail — already partially built, needs these improvements:

**From the reference images, the real PO has:**
- Header section: PO number + status chip, created by + date (top right)
- Supplier section: supplier selector with name, address, business number, email, landline
- Site section: site selector with business name, email, address
- Project section: project search (optional)
- Details section: Title field, Status dropdown, Invoice term, Delivery status, Delivery due date, Purchase order date, Delivered date, Supplier invoice #, Supplier Invoice Date, Payment method, Template, Owner/Sales Rep, Workflow, Currency, External link, Sent checkbox

**Jobs & inventory tab:**
- Shows job banner: "Job: 3701 on Thursday 19 Mar 2026 at 10:30AM. Type: General Service..."
- Table: Type | Job type | Category | Inventory Code | Description | Received qty | Unused qty | Qty | Purchase | Markup % | Sales | Tax | Amount
- "+ Item" and "Copy items to job" links at bottom
- "+ Section", "Import CSV", "Export CSV", "Select items", "Refresh pricing" buttons
- Totals: Total Services (Ex), Total Products (Ex), Subtotal, Tax amount, TOTAL

**Action buttons row (bottom):** Close | Preview | Download | Email | Copy | Create job ▼ | Submit | Receive all | Create Supplier Credit Note | Use Credit | Export to Xero | Delete

---

### 3. PO Print Preview (`/po-print/:id`)
Matches the Kingy's printed PO document exactly:

**Header:**
- Kingy's logo area (red/orange KINGY'S DIESEL INDUSTRIES badge — use a styled div)
- Company address: Shed 6/1505 Nambour Connection Rd, Yandina QLD 4561, 07 5446 7396
- Right side: "PURCHASE ORDER" heading, PO number, Purchase Order Date, Required By, Created By

**Supplier block:** Name and address (left), Deliver to Site: Kingy's Diesel Industries address (right)

**Job Number** label

**Products table:** Code | Description | Quantity | Purchase price | Discount | Total AUD

**Totals:** Subtotal | GST Amount | Total AUD

---

### 4. Supplier Price Books — improvements needed:

**Per the reference images:**
- The "Supplier Pricing" tab on Edit Product shows a table: Supplier Code | Supplier | Purchase $ | Mark up % | Sales $ | Tax
- Each row is editable inline
- Currently empty in real FieldInsight — our prototype should show it populated with multi-supplier data

---

## Design System

**Colours:**
- Purple sidebar: `#674EA7`
- Blue header/buttons: `#027BFF`
- Orange accent/actions: `#F57C00` (buttons, active tab, code links)
- Background: `#f9f9f9`
- Card/table background: `#ffffff`
- Purple tint rows: `#f5f0ff`

**Typography:** -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

**Buttons (bottom action bar):** Purple contained MUI buttons, orange for primary actions (Submit), red for Delete

**Nav tabs:** Orange underline indicator on active tab, orange text

---

## Routing

```
/                        → redirect to /products
/products                → Products inventory list
/supplier-price-books    → Supplier Price Books management + CSV import
/purchase-orders-list    → PO list (NEW — build this)
/purchase-orders         → PO detail / edit view
/po-print/:id            → PO print preview (NEW — build this)
/bill-diff               → Bill Difference Report
```

---

## After Each Build

1. Run `npm run build` to check for errors
2. Fix any TypeScript/ESLint errors
3. `git add -A && git commit -m "feat: description v0.X.Y" && git push`
4. Sync build folder to Mac Studio: `rsync -az build/ ~/prototypes/proto-multi-supplier-po/build/`
5. Send Paul a WhatsApp via notify_paul() confirming what was built and that the URL is ready
