import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor
api.interceptors.response.use((response) => {
  // Nếu response có data thì trả về data, không thì trả về response
  return response.data || response;
}, (error) => {
  const message = error.response?.data?.message || 'Có lỗi xảy ra';
  return Promise.reject({
    ...error,
    message
  });
});

export default api;