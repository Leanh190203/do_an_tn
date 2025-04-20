import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response và lỗi
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

const apiService = {
  // Auth APIs
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/user/login', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/user/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Protected APIs
  getAllPets: () => axiosInstance.get('/pets'),
  getPet: (id) => axiosInstance.get(`/pets/${id}`),
  createPet: (petData) => axiosInstance.post('/pets', petData),
  updatePet: (id, petData) => axiosInstance.put(`/pets/${id}`, petData),
  deletePet: (id) => axiosInstance.delete(`/pets/${id}`),

  getAllCustomers: () => axiosInstance.get('/customers'),
  getCustomer: (id) => axiosInstance.get(`/customers/${id}`),
  createCustomer: (customerData) => axiosInstance.post('/customers', customerData),
  updateCustomer: (id, customerData) => axiosInstance.put(`/customers/${id}`, customerData),
  deleteCustomer: (id) => axiosInstance.delete(`/customers/${id}`),
  getCustomerPets: (id) => axiosInstance.get(`/customers/${id}/pets`),
  
  // Appointment APIs
  getAllAppointments: () => axiosInstance.get('/appointments'),
  getAppointment: (id) => axiosInstance.get(`/appointments/${id}`),
  createAppointment: (appointmentData) => axiosInstance.post('/appointments', appointmentData),
  updateAppointment: (id, appointmentData) => axiosInstance.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => axiosInstance.delete(`/appointments/${id}`),
  
  // Dashboard APIs
  getDashboardStats: () => axiosInstance.get('/dashboard/stats'),
  getReportsData: () => axiosInstance.get('/dashboard/reports')
};

export default apiService;
