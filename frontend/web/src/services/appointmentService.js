import apiService from './apiService';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Tạo instance axios cho các API phụ
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

// Xử lý response
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error);
  }
);

const appointmentService = {
  getAllAppointments: async () => {
    try {
      const response = await apiService.getAllAppointments();
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await apiService.getAppointment(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await apiService.createAppointment(appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await apiService.updateAppointment(id, appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    try {
      const response = await apiService.deleteAppointment(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/appointments/${id}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsByPet: async (petId) => {
    try {
      const response = await axiosInstance.get(`/pets/${petId}/appointments`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentsByCustomer: async (customerId) => {
    try {
      const response = await axiosInstance.get(`/customers/${customerId}/appointments`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default appointmentService;