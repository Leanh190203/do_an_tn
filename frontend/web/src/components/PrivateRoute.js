import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Kiểm tra token khi component mount
    if (!isAuthenticated) {
      // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [location, isAuthenticated]);

  if (!isAuthenticated) {
    // Chuyển hướng về trang login nếu chưa xác thực
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;