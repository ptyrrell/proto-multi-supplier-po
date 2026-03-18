import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const FI_PURPLE = '#674EA7';
const FI_BLUE   = '#027BFF';
const FI_ORANGE = '#F57C00';

const NAV_TABS = [
  { label: 'Services',                path: '/services' },
  { label: 'Products',                path: '/products' },
  { label: 'Additional charges',      path: '/additional-charges' },
  { label: 'Subcontractor services',  path: '/subcontractor' },
  { label: 'Packages',                path: '/packages' },
  { label: 'Stocktakes',              path: '/stocktakes' },
  { label: 'Cost Centres',            path: '/cost-centres' },
  { label: 'Cost Codes',              path: '/cost-codes' },
  { label: 'Transactions',            path: '/transactions' },
  { label: 'Supplier Price Books',    path: '/supplier-price-books' },
  { label: 'Purchase Orders',         path: '/purchase-orders-list' },
];

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = NAV_TABS.findIndex(t =>
    location.pathname.startsWith(t.path)
  );

  return (
    <Box sx={{ borderBottom: '2px solid #e0e0e0', backgroundColor: '#fff' }}>
      <Tabs
        value={currentTab === -1 ? 1 : currentTab}
        onChange={(_, v) => navigate(NAV_TABS[v].path)}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{ style: { backgroundColor: FI_ORANGE, height: 3 } }}
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '0.82rem',
            fontWeight: 500,
            color: '#555',
            minWidth: 'unset',
            px: 2,
          },
          '& .Mui-selected': {
            color: `${FI_ORANGE} !important`,
            fontWeight: 700,
          },
          '& .MuiTab-root:last-child': {
            color: FI_BLUE,
            fontWeight: 700,
          },
        }}
      >
        {NAV_TABS.map(t => (
          <Tab key={t.path} label={t.label} />
        ))}
      </Tabs>
    </Box>
  );
};

export const Sidebar: React.FC = () => (
  <Box sx={{
    width: 220, flexShrink: 0, backgroundColor: FI_PURPLE,
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
  }}>
    <Box sx={{ backgroundColor: FI_BLUE, px: 2, py: 1.5 }}>
      <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: 1 }}>
        FIELDINSIGHT
      </Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>
        Kingy's Diesel Industries
      </Typography>
    </Box>
    {['Jobs', 'Schedule', 'Customers', 'Quotes', 'Invoices', 'Inventory', 'Purchase Orders', 'Reports'].map(item => (
      <Box
        key={item}
        sx={{
          px: 2.5, py: 1.2, cursor: 'pointer',
          backgroundColor: item === 'Inventory' ? 'rgba(255,255,255,0.15)' : 'transparent',
          borderLeft: item === 'Inventory' ? '3px solid #fff' : '3px solid transparent',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
        }}
      >
        <Typography sx={{ color: '#fff', fontSize: '0.82rem', fontWeight: item === 'Inventory' ? 700 : 400 }}>
          {item}
        </Typography>
      </Box>
    ))}
  </Box>
);
