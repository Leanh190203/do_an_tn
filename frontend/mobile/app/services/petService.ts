import api from './api';
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

export const petService = {
  // Get all pets
  getAllPets: async () => {
    try {
      const token = global.authToken;
      const response = await api.get('/pets', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch pets';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching pets.');
    }
  },
  
  // Get pet by ID
  getPetById: async (id: number) => {
    try {
      const token = global.authToken;
      const response = await api.get(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch pet details';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching pet details.');
    }
  },
  
  // Create new pet
  createPet: async (petData: any) => {
    try {
      const token = global.authToken;
      const response = await api.post('/pets', petData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to create pet';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while creating pet.');
    }
  },
  
  // Update pet
  updatePet: async (id: number, petData: any) => {
    try {
      const token = global.authToken;
      const response = await api.put(`/pets/${id}`, petData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to update pet';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while updating pet.');
    }
  },
  
  // Delete pet
  deletePet: async (id: number) => {
    try {
      const token = global.authToken;
      const response = await api.delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to delete pet';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while deleting pet.');
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

export default petService; 