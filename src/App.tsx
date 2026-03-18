import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Sidebar, TopNav } from './components/Layout';
import { ProductsPage } from './pages/ProductsPage';
import { SupplierPriceBooksPage } from './pages/SupplierPriceBooksPage';
import { POPage } from './pages/POPage';
import { BillDiffPage } from './pages/BillDiffPage';

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
            <Route path="/"                     element={<Navigate to="/products" replace />} />
            <Route path="/products"             element={<ProductsPage />} />
            <Route path="/supplier-price-books" element={<SupplierPriceBooksPage />} />
            <Route path="/purchase-orders"      element={<POPage />} />
            <Route path="/bill-diff"            element={<BillDiffPage />} />
            <Route path="*"                     element={<Navigate to="/products" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
