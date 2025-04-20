import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  const message = error.response?.data?.message || 
                 error.message || 
                 'Có lỗi xảy ra, vui lòng thử lại sau';
  
  toast.error(message);
  
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  return Promise.reject(error);
};

export const showSuccess = (message) => {
  toast.success(message);
};

export const showWarning = (message) => {
  toast.warning(message);
};

export const showInfo = (message) => {
  toast.info(message);
};