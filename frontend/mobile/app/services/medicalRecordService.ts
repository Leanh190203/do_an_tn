import api from './api';
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
}

export interface MedicalRecord {
  id?: number;
  pet_id: number;
  customer_id: number;
  date: string;
  diagnosis?: string;
  service: string;
  clinic: string;
  notes?: string;
  status: string;
}

const medicalRecordService = {
  // Create a new medical record
  createMedicalRecord: async (data: MedicalRecord) => {
    try {
      const token = global.authToken;
      const response = await api.post('/appointments', {
        pet_id: data.pet_id,
        customer_id: data.customer_id,
        appointment_date: data.date,
        service: data.service, // Fixed field mapping
        notes: data.notes || '',
        diagnosis: data.diagnosis, // Fixed field mapping
        clinic: data.clinic || '',
        status: data.status
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to create medical record';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while creating medical record.');
    }
  },
  
  // Get all medical records
  getAllMedicalRecords: async () => {
    try {
      const token = global.authToken;
      const response = await api.get('/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Map appointments to medical records format with detailed information
      return response.data.map((appointment: any) => ({
        id: appointment.id,
        pet_id: appointment.pet_id,
        customer_id: appointment.customer_id,
        date: appointment.appointment_date,
        service: appointment.service,
        notes: appointment.notes || '',
        diagnosis: appointment.diagnosis || '',
        clinic: appointment.clinic || '',
        status: appointment.status,
        // Giữ lại thông tin thú cưng và chủ sở hữu
        pet: appointment.pet,
        customer: appointment.customer,
        petName: appointment.petName, // Dự phòng nếu không có object pet
        customerName: appointment.customerName, // Dự phòng nếu không có object customer
        // Thêm thông tin khác nếu có
        formatted_date: appointment.formatted_date,
        formatted_time: appointment.formatted_time
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch medical records';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching medical records.');
    }
  },
  
  // Get medical records by customer ID
  getMedicalRecordsByCustomerId: async (customerId: number) => {
    try {
      const token = global.authToken;
      const response = await api.get(`/appointments/customer/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Map appointments to medical records format with detailed information
      return response.data.map((appointment: any) => ({
        id: appointment.id,
        pet_id: appointment.pet_id,
        customer_id: appointment.customer_id,
        date: appointment.appointment_date,
        service: appointment.service,
        notes: appointment.notes || '',
        diagnosis: appointment.diagnosis || '',
        clinic: appointment.clinic || '',
        status: appointment.status,
        // Giữ lại thông tin thú cưng và chủ sở hữu
        pet: appointment.pet,
        customer: appointment.customer,
        petName: appointment.petName, // Dự phòng nếu không có object pet
        customerName: appointment.customerName, // Dự phòng nếu không có object customer
        // Thêm thông tin khác nếu có
        formatted_date: appointment.formatted_date,
        formatted_time: appointment.formatted_time
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch customer medical records';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching customer medical records.');
    }
  },
  
  // Get a specific medical record by ID
  getMedicalRecord: async (id: number) => {
    try {
      const token = global.authToken;
      const response = await api.get(`/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const appointment = response.data;
      // Convert appointment to medical record format with detailed information
      return {
        id: appointment.id,
        pet_id: appointment.pet_id,
        customer_id: appointment.customer_id,
        date: appointment.appointment_date,
        service: appointment.service,
        notes: appointment.notes || '',
        diagnosis: appointment.diagnosis || '',
        clinic: appointment.clinic || '',
        status: appointment.status,
        // Giữ lại thông tin thú cưng và chủ sở hữu
        pet: appointment.pet,
        customer: appointment.customer,
        petName: appointment.petName, // Dự phòng nếu không có object pet
        customerName: appointment.customerName, // Dự phòng nếu không có object customer
        // Thêm thông tin khác nếu có
        formatted_date: appointment.formatted_date,
        formatted_time: appointment.formatted_time
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch medical record';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching medical record.');
    }
  },
  
  // Update a medical record
  updateMedicalRecord: async (id: number, data: MedicalRecord) => {
    try {
      const token = global.authToken;
      const response = await api.put(`/appointments/${id}`, {
        pet_id: data.pet_id,
        customer_id: data.customer_id,
        appointment_date: data.date,
        service: data.service, // Fixed field mapping
        notes: data.notes || '',
        diagnosis: data.diagnosis, // Fixed field mapping
        clinic: data.clinic || '',
        status: data.status
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to update medical record';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while updating medical record.');
    }
  },
  
  // Delete medical record
  deleteMedicalRecord: async (id: number) => {
    try {
      const token = global.authToken;
      const response = await api.delete(`/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to delete medical record';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while deleting medical record.');
    }
  }
};

export default medicalRecordService;