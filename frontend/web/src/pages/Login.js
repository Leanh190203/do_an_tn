import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin đăng nhập');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a237e 0%, #0288d1 100%)',
        p: 2,
        boxSizing: 'border-box'
      }}
    >
      <Paper elevation={10} sx={{ 
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        maxWidth: 800,
        width: '100%',
        margin: 'auto'
      }}>
        {/* Left side - Image */}
        <Box sx={{
          flex: 1,
          bgcolor: '#fff',
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          borderRight: '1px solid #eee'
        }}>
          <Box sx={{ 
            textAlign: 'center',
            maxWidth: '300px',
            margin: 'auto'
          }}>
            <PetsIcon sx={{ 
              fontSize: 80, 
              color: '#1a237e', 
              mb: 2,
              margin: 'auto'
            }} />
            <Typography variant="h4" color="primary" gutterBottom>
              Pet Care
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Chăm sóc thú cưng của bạn với sự tận tâm
            </Typography>
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Box sx={{ 
          flex: 1,
          bgcolor: '#ffffff',
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minWidth: { xs: '100%', md: '400px' }
        }}>
          <Box sx={{ 
            width: '100%',
            maxWidth: '400px',
            margin: 'auto'
          }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ 
                color: '#1a237e', 
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Đăng nhập
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                textAlign: 'center'
              }}>
                Đăng nhập để quản lý hệ thống
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'center' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!error}
                autoComplete="email"
                autoFocus
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                disabled={loading}
                error={!!error}
                autoComplete="current-password"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  bgcolor: '#1a237e',
                  '&:hover': {
                    bgcolor: '#0d47a1'
                  }
                }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;