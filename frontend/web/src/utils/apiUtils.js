import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  const defaultMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
  
  if (!error.response) {
    toast.error(defaultMessage);
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      if (data.message) {
        toast.error(data.message);
      } else if (data.errors) {
        const messages = Object.values(data.errors).flat();
        messages.forEach(message => toast.error(message));
      } else {
        toast.error('Yêu cầu không hợp lệ.');
      }
      break;
    case 401:
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      // You can add logic here to redirect to login page
      break;
    case 403:
      toast.error('Bạn không có quyền thực hiện thao tác này.');
      break;
    case 404:
      toast.error('Không tìm thấy dữ liệu yêu cầu.');
      break;
    case 422:
      if (data.errors) {
        const messages = Object.values(data.errors).flat();
        messages.forEach(message => toast.error(message));
      } else {
        toast.error('Dữ liệu không hợp lệ.');
      }
      break;
    case 500:
      toast.error('Lỗi hệ thống. Vui lòng thử lại sau.');
      break;
    default:
      toast.error(defaultMessage);
  }
};

export const createApiService = (axiosInstance) => {
  const handleRequest = async (request) => {
    try {
      const response = await request();
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };

  return {
    get: (url, config) => handleRequest(() => axiosInstance.get(url, config)),
    post: (url, data, config) => handleRequest(() => axiosInstance.post(url, data, config)),
    put: (url, data, config) => handleRequest(() => axiosInstance.put(url, data, config)),
    patch: (url, data, config) => handleRequest(() => axiosInstance.patch(url, data, config)),
    delete: (url, config) => handleRequest(() => axiosInstance.delete(url, config)),
  };
};

export const formatValidationErrors = (errors) => {
  const formattedErrors = {};
  
  for (const [field, messages] of Object.entries(errors)) {
    formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages;
  }
  
  return formattedErrors;
};

export const createQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key + '[]', v));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};