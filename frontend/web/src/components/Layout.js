import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { sm: 30 }, // Margin left khi màn hình lớn hơn sm
          width: { sm: `calc(100% - 240px)` }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;