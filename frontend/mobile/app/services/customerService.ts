import api from './api';
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

export const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      const token = global.authToken;
      const response = await api.get('/customers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch customers';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching customers.');
    }
  },
  
  // Get customer by ID
  getCustomerById: async (id: number) => {
    try {
      const token = global.authToken;
      const response = await api.get(`/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch customer details';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching customer details.');
    }
  },
  
  // Create new customer
  createCustomer: async (customerData: any) => {
    try {
      const token = global.authToken;
      const response = await api.post('/customers', customerData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to create customer';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while creating customer.');
    }
  },
  
  // Update customer
  updateCustomer: async (id: number, customerData: any) => {
    try {
      const token = global.authToken;
      const response = await api.put(`/customers/${id}`, customerData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to update customer';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while updating customer.');
    }
  },
  
  // Delete customer
  deleteCustomer: async (id: number) => {
    try {
      const token = global.authToken;
      const response = await api.delete(`/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to delete customer';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while deleting customer.');
    }
  },
  
  // Get customer's pets
  getCustomerPets: async (customerId: number) => {
    try {
      const token = global.authToken;
      const response = await api.get(`/customers/${customerId}/pets`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch customer pets';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching customer pets.');
    }
  }
};

export default customerService; 