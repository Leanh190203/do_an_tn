import api from './apiService';

const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await api.getAllCustomers();
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await api.getCustomer(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.createCustomer(customerData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.updateCustomer(id, customerData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await api.deleteCustomer(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default customerService;