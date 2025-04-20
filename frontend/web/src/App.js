import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PetList from './pages/PetList';
import CustomerList from './pages/CustomerList';
import AppointmentList from './pages/AppointmentList';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#0288d1',
      light: '#5eb8ff',
      dark: '#005b9f',
    },
    background: {
      default: '#f5f5f5'
    }
  }
});

// Route bảo vệ yêu cầu xác thực
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    // Thiết lập interceptor cho axios
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Xử lý lỗi 401 (Unauthorized)
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <Dashboard />
                  </Box>
                </>
              </PrivateRoute>
            } />
            
            <Route path="/pets" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <PetList />
                  </Box>
                </>
              </PrivateRoute>
            } />
            
            <Route path="/customers" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <CustomerList />
                  </Box>
                </>
              </PrivateRoute>
            } />
            
            <Route path="/appointments" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <AppointmentList />
                  </Box>
                </>
              </PrivateRoute>
            } />
            
            <Route path="/reports" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                    <Reports />
                  </Box>
                </>
              </PrivateRoute>
            } />

            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route path="/" element={
              localStorage.getItem('token') ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } />
          </Routes>
        </Box>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
