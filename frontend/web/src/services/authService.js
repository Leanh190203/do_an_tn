import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/user/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Set token cho tất cả các requests tiếp theo
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Thiết lập token cho API calls
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
};

// Tự động thiết lập token khi service được import
authService.initializeAuth();

export default authService;