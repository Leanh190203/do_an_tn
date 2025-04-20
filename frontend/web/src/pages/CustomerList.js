import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import customerService from '../services/customerService';
import petService from '../services/petService';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPets, setCustomerPets] = useState([]);
  const [showPetsDialog, setShowPetsDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers();
      console.log('Fetched customers:', data);
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Lỗi khi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Auto refresh every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing customer data...');
      fetchCustomers();
    }, 60000); // refresh every minute

    return () => clearInterval(intervalId);  // Clean up on unmount
  }, []);

  const handleOpen = (customer = null) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address || ''
      });
    } else {
      setSelectedCustomer(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: ''
      });
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.phone) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      if (selectedCustomer) {
        await customerService.updateCustomer(selectedCustomer.id, formData);
        toast.success('Cập nhật khách hàng thành công');
      } else {
        await customerService.createCustomer(formData);
        toast.success('Thêm khách hàng thành công');
      }
      handleClose();
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await customerService.deleteCustomer(id);
        toast.success('Xóa khách hàng thành công');
        fetchCustomers();
      } catch (error) {
        toast.error('Lỗi khi xóa khách hàng');
      }
    }
  };

  const handleViewPets = async (customer) => {
    try {
      const pets = await petService.getCustomerPets(customer.id);
      setCustomerPets(pets);
      setSelectedCustomer(customer);
      setShowPetsDialog(true);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thú cưng');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#1a237e' }}>
          Danh sách khách hàng
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              toast.info('Đang làm mới dữ liệu...');
              fetchCustomers();
            }}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#1a237e' }}
            onClick={() => handleOpen()}
          >
            Thêm khách hàng
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Thú cưng</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<PetsIcon />}
                      label={`${customer.pets?.length || 0} thú cưng`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewPets(customer)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(customer)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(customer.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCustomer ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên khách hàng"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <TextField
              fullWidth
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedCustomer ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Pets Dialog */}
      <Dialog 
        open={showPetsDialog} 
        onClose={() => {
          setShowPetsDialog(false);
          setSelectedCustomer(null);
          setCustomerPets([]);
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Thú cưng của {selectedCustomer?.name}
        </DialogTitle>
        <DialogContent>
          {customerPets.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1">Khách hàng này chưa có thú cưng nào.</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => {
                  setShowPetsDialog(false);
                  setSelectedCustomer(null);
                  setCustomerPets([]);
                  // Điều hướng đến trang thêm thú cưng
                  window.location.href = '/pets/add';
                }}
              >
                Thêm thú cưng mới
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Loài</TableCell>
                    <TableCell>Tuổi</TableCell>
                    <TableCell>Cân nặng</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Triệu chứng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerPets.map((pet) => (
                    <TableRow key={pet.id} hover>
                      <TableCell>{pet.name}</TableCell>
                      <TableCell>{pet.species}</TableCell>
                      <TableCell>{pet.age}</TableCell>
                      <TableCell>{pet.weight} kg</TableCell>
                      <TableCell sx={{ maxWidth: '200px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{pet.description}</TableCell>
                      <TableCell sx={{ maxWidth: '200px', whiteSpace: 'normal', wordBreak: 'break-word' }}>{pet.symptoms}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowPetsDialog(false);
            setSelectedCustomer(null);
            setCustomerPets([]);
          }}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerList;

