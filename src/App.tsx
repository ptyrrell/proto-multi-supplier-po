import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { Sidebar, TopNav } from './components/Layout';
import { ProductsPage } from './pages/ProductsPage';
import { SupplierPriceBooksPage } from './pages/SupplierPriceBooksPage';
import { POPage } from './pages/POPage';
import { POListPage } from './pages/POListPage';
import { POPrintPage } from './pages/POPrintPage';
import { BillDiffPage } from './pages/BillDiffPage';
import { BillsListPage } from './pages/BillsListPage';
import { BillDetailPage } from './pages/BillDetailPage';

const theme = createTheme({
  palette: {
    primary:   { main: '#674EA7' },
    secondary: { main: '#F57C00' },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 4, fontWeight: 600 } } },
    MuiChip:   { styleOverrides: { root: { borderRadius: 4 } } },
  },
});

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopNav />
        <Box sx={{ flex: 1, overflow: 'auto', p: 3, backgroundColor: '#f9f9f9' }}>
          {children}
        </Box>
        {/* Version footer */}
        <Box sx={{ px: 3, py: 0.5, borderTop: '1px solid #e0e0e0', backgroundColor: '#fafafa',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#bbb', fontSize: '0.65rem' }}>
            Supplier Price Books Prototype — v0.4.0
          </Typography>
          <Typography variant="caption" sx={{ color: '#bbb', fontSize: '0.65rem' }}>
            Kingy's Diesel Industries · Built by Alfred
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/"                       element={<Navigate to="/products" replace />} />
            <Route path="/products"               element={<ProductsPage />} />
            <Route path="/supplier-price-books"   element={<SupplierPriceBooksPage />} />
            <Route path="/purchase-orders"        element={<POPage />} />
            <Route path="/purchase-orders-list"   element={<POListPage />} />
            <Route path="/po-print/:id"           element={<POPrintPage />} />
            <Route path="/bill-diff"              element={<BillDiffPage />} />
            <Route path="/bills"                  element={<BillsListPage />} />
            <Route path="/bills/:id"              element={<BillDetailPage />} />
            <Route path="*"                       element={<Navigate to="/products" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
