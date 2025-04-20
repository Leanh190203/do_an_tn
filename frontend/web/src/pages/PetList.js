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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import petService from '../services/petService';
import customerService from '../services/customerService';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    age: '',
    weight: '',
    description: '',
    symptoms: '',
    customer_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsData, customersData] = await Promise.all([
        petService.getAllPets(),
        customerService.getAllCustomers()
      ]);
      setPets(petsData);
      setCustomers(customersData);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (pet = null) => {
    if (pet) {
      setSelectedPet(pet);
      setFormData({
        name: pet.name,
        species: pet.species,
        age: pet.age || '',
        weight: pet.weight || '',
        description: pet.description || '',
        symptoms: pet.symptoms || '',
        customer_id: pet.customer_id
      });
    } else {
      setSelectedPet(null);
      setFormData({
        name: '',
        species: '',
        age: '',
        weight: '',
        description: '',
        symptoms: '',
        customer_id: ''
      });
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedPet(null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.species || !formData.customer_id) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      let response;
      if (selectedPet) {
        response = await petService.updatePet(selectedPet.id, formData);
        toast.success('Cập nhật thú cưng thành công');
      } else {
        response = await petService.createPet(formData);
        toast.success('Thêm thú cưng thành công');
      }
      handleClose();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thú cưng này?')) {
      try {
        await petService.deletePet(id);
        toast.success('Xóa thú cưng thành công');
        fetchData();
      } catch (error) {
        toast.error('Lỗi khi xóa thú cưng');
      }
    }
  };

  const filteredPets = pets.filter(pet =>
    pet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.species?.toLowerCase().includes(searchTerm.toLowerCase())
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
          Danh sách thú cưng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#1a237e' }}
          onClick={() => handleOpen()}
        >
          Thêm thú cưng
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm theo tên hoặc loài..."
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Loài</TableCell>
                <TableCell>Tuổi</TableCell>
                <TableCell>Cân nặng</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Triệu chứng</TableCell>
                <TableCell>Chủ sở hữu</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell>{pet.name}</TableCell>
                  <TableCell>{pet.species}</TableCell>
                  <TableCell>{pet.age}</TableCell>
                  <TableCell>{pet.weight}</TableCell>
                  <TableCell>{pet.description}</TableCell>
                  <TableCell>{pet.symptoms}</TableCell>
                  <TableCell>
                    {customers.find(c => c.id === pet.customer_id)?.name || 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(pet)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(pet.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPet ? 'Cập nhật thú cưng' : 'Thêm thú cưng mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Tên thú cưng"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Loài"
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Tuổi"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />

            <TextField
              fullWidth
              label="Cân nặng (kg)"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />

            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <TextField
              fullWidth
              label="Triệu chứng bệnh"
              multiline
              rows={2}
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />

            <FormControl fullWidth required>
              <InputLabel>Chủ sở hữu</InputLabel>
              <Select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                label="Chủ sở hữu"
              >
                <MenuItem value="">
                  <em>Chọn chủ sở hữu</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedPet ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PetList;