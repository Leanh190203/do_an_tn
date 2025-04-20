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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  InputAdornment,
  TablePagination
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import appointmentService from '../services/appointmentService';
import customerService from '../services/customerService';
import petService from '../services/petService';
import { toast } from 'react-toastify';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';
import { useLocation } from 'react-router-dom';

const AppointmentList = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    pet_id: '',
    appointment_date: new Date(),
    service: '',
    notes: '',
    status: 'pending'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      const [appointmentsData, customersData] = await Promise.all([
        appointmentService.getAllAppointments(),
        customerService.getAllCustomers()
      ]);
      setAppointments(appointmentsData);
      setCustomers(customersData);
      setLoading(false);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state?.openAddDialog) {
      handleOpen();
    }
  }, [location]);

  const fetchPetsByCustomer = async (customerId) => {
    try {
      const petsData = await petService.getCustomerPets(customerId);
      setPets(petsData);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thú cưng');
    }
  };

  const handleCustomerChange = (event) => {
    const customerId = event.target.value;
    setFormData(prev => ({ ...prev, customer_id: customerId, pet_id: '' }));
    if (customerId) {
      fetchPetsByCustomer(customerId);
    } else {
      setPets([]);
    }
  };

  const handleOpen = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        customer_id: appointment.customer_id,
        pet_id: appointment.pet_id,
        appointment_date: new Date(appointment.appointment_date),
        service: appointment.service,
        notes: appointment.notes,
        status: appointment.status
      });
      fetchPetsByCustomer(appointment.customer_id);
    } else {
      setSelectedAppointment(null);
      setFormData({
        customer_id: '',
        pet_id: '',
        appointment_date: new Date(),
        service: '',
        notes: '',
        status: 'pending'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedAppointment) {
        await appointmentService.updateAppointment(selectedAppointment.id, formData);
        toast.success('Cập nhật lịch hẹn thành công');
      } else {
        await appointmentService.createAppointment(formData);
        toast.success('Tạo lịch hẹn thành công');
      }
      handleClose();
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      try {
        await appointmentService.deleteAppointment(id);
        toast.success('Xóa lịch hẹn thành công');
        fetchData();
      } catch (error) {
        toast.error('Lỗi khi xóa lịch hẹn');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'error',
      completed: 'info'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = (
      appointment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
        <Typography variant="h4" sx={{ color: 'primary.main' }}>
          Danh sách lịch hẹn
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm lịch hẹn
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            sx={{ flexGrow: 1, minWidth: '200px' }}
            placeholder="Tìm kiếm theo tên khách hàng, thú cưng hoặc dịch vụ..."
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
          <FormControl sx={{ minWidth: '200px' }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Trạng thái"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredAppointments.length === 0 ? (
          <EmptyState
            title="Không tìm thấy lịch hẹn"
            message="Không có lịch hẹn nào phù hợp với tìm kiếm của bạn"
            icon={EditIcon}
            showAction={false}
          />
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Thú cưng</TableCell>
                    <TableCell>Ngày giờ</TableCell>
                    <TableCell>Dịch vụ</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ghi chú</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAppointments.map((appointment) => (
                    <TableRow key={appointment.id} hover>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.customerName}</TableCell>
                      <TableCell>{appointment.petName}</TableCell>
                      <TableCell>
                        {format(new Date(appointment.appointment_date), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(appointment.status)}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{appointment.notes}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(appointment)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(appointment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredAppointments.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} trong số ${count}`
              }
            />
          </>
        )}
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Cập nhật lịch hẹn' : 'Thêm lịch hẹn mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Khách hàng</InputLabel>
              <Select
                value={formData.customer_id}
                onChange={handleCustomerChange}
                label="Khách hàng"
              >
                <MenuItem value="">
                  <em>Chọn khách hàng</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!formData.customer_id}>
              <InputLabel>Thú cưng</InputLabel>
              <Select
                value={formData.pet_id}
                onChange={(e) => setFormData(prev => ({ ...prev, pet_id: e.target.value }))}
                label="Thú cưng"
              >
                <MenuItem value="">
                  <em>Chọn thú cưng</em>
                </MenuItem>
                {pets.map((pet) => (
                  <MenuItem key={pet.id} value={pet.id}>
                    {pet.name} - {pet.species}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <DateTimePicker
                label="Ngày giờ hẹn"
                value={formData.appointment_date}
                onChange={(newValue) => setFormData(prev => ({ ...prev, appointment_date: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              label="Dịch vụ"
              value={formData.service}
              onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
            />

            <TextField
              fullWidth
              label="Ghi chú"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />

            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                label="Trạng thái"
              >
                <MenuItem value="pending">Chờ xác nhận</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedAppointment ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentList;