import axios from 'axios';

// Khai báo global namespace để TypeScript biết về authToken
declare global {
  var authToken: string | undefined;
  var currentUser: any | undefined;
}

// Cấu hình Axios instance
const api = axios.create({
  // Đối với máy ảo Android, sử dụng 10.0.2.2 để truy cập localhost của máy host
  // Đối với thiết bị thật, cần sử dụng IP thực của máy chủ
  // Vui lòng điều chỉnh dựa trên môi trường phát triển
  baseURL: ' http://192.168.100.169:5000/api', // đổi địa chỉ ip khi thay đổi mạng wifi
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// API auth service
export const authService = {
  // Đăng ký tài khoản
  register: async (userData: { name: string; email: string; password: string; phone?: string; address?: string }) => {
    try {
      const response = await api.post('/user/register', userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Lỗi được trả về từ server
          const errorMessage = error.response.data.message || 'Đăng ký thất bại';
          throw new Error(errorMessage);
        } else if (error.request) {
          // Yêu cầu được gửi nhưng không nhận được phản hồi
          throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
        }
      }
      // Lỗi không xác định
      throw new Error('Đã xảy ra lỗi không xác định khi đăng ký tài khoản.');
    }
  },
  
  // Đăng nhập
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/user/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Lỗi được trả về từ server
          const errorMessage = error.response.data.message || 'Đăng nhập thất bại';
          throw new Error(errorMessage);
        } else if (error.request) {
          // Yêu cầu được gửi nhưng không nhận được phản hồi
          throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
        }
      }
      // Lỗi không xác định
      throw new Error('Đã xảy ra lỗi không xác định khi đăng nhập.');
    }
  },
  
  // Cập nhật thông tin người dùng
  updateUserProfile: async (userId: number, userData: { name?: string; phone?: string; address?: string }) => {
    try {
      const token = global.authToken;
      const response = await api.put(`/user/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data.message || 'Cập nhật thông tin thất bại';
          throw new Error(errorMessage);
        } else if (error.request) {
          throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
        }
      }
      throw new Error('Đã xảy ra lỗi không xác định khi cập nhật thông tin.');
    }
  },
  
  // Đổi mật khẩu
  changePassword: async (userId: number, passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      const token = global.authToken;
      const response = await api.put(`/user/${userId}/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data.message || 'Đổi mật khẩu thất bại';
          throw new Error(errorMessage);
        } else if (error.request) {
          throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
        }
      }
      throw new Error('Đã xảy ra lỗi không xác định khi đổi mật khẩu.');
    }
  }
};

export default api; 