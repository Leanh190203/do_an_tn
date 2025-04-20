import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/api';

// Định nghĩa kiểu dữ liệu cho User
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  [key: string]: any; // Cho phép thêm các trường khác
}

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Tạo context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khôi phục trạng thái đăng nhập khi khởi động ứng dụng
  useEffect(() => {
    // Kiểm tra xem đã có thông tin đăng nhập từ lần trước không
    const loadStoredData = () => {
      try {
        // Trong môi trường thực tế, bạn sẽ sử dụng AsyncStorage để lưu trữ dữ liệu
        // Hiện tại chúng ta sử dụng biến global để demo
        if (global.authToken && global.currentUser) {
          setToken(global.authToken);
          setUser(global.currentUser);
        }
      } catch (error) {
        console.error('Lỗi khi khôi phục trạng thái đăng nhập:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Hàm đăng nhập
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      setUser(response.user);
      setToken(response.token);
      
      // Lưu trữ token và thông tin người dùng
      global.authToken = response.token;
      global.currentUser = response.user;
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại, vui lòng thử lại';
      Alert.alert('Lỗi', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Xóa thông tin đăng nhập đã lưu
    global.authToken = undefined;
    global.currentUser = undefined;
  };

  // Cập nhật thông tin người dùng
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      global.currentUser = updatedUser;
    }
  };

  // Giá trị context cung cấp cho các component con
  const value = {
    user,
    token,
    isLoading,
    isSignedIn: !!user,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 