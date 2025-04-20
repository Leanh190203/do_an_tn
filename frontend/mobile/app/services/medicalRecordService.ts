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
  diagnosis: string;
  service: string;
  clinic: string;
  notes?: string;
}

const medicalRecordService = {
  // Create a new medical record
  createMedicalRecord: async (data: MedicalRecord) => {
    try {
      const token = global.authToken;
      // For now, we're using the appointment endpoint as there's no dedicated medical record endpoint
      const response = await api.post('/appointments', {
        pet_id: data.pet_id,
        customer_id: data.customer_id,
        appointment_date: data.date,
        service: data.service,
        notes: `Chẩn đoán: ${data.diagnosis}\nPhòng khám: ${data.clinic}\n${data.notes || ''}`,
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
  
  // Get all medical records (using appointments for now)
  getAllMedicalRecords: async () => {
    try {
      const token = global.authToken;
      const response = await api.get('/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform appointment data to medical record format
      const records = response.data.map((appointment: any) => {
        // Try to extract diagnosis and clinic from notes field if available
        const notes = appointment.notes || '';
        const diagnosisMatch = notes.match(/Chẩn đoán: (.+?)(?:\n|$)/);
        const clinicMatch = notes.match(/Phòng khám: (.+?)(?:\n|$)/);
        
        return {
          id: appointment.id,
          pet_id: appointment.pet_id,
          petName: appointment.petName,
          customer_id: appointment.customer_id,
          owner: appointment.customerName,
          date: appointment.appointment_date,
          diagnosis: diagnosisMatch ? diagnosisMatch[1] : 'Không có',
          service: appointment.service,
          clinic: clinicMatch ? clinicMatch[1] : 'Không có',
          notes: notes
        };
      });
      
      return records;
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
  
  // Get medical record by ID
  getMedicalRecordById: async (id: number) => {
    try {
      const token = global.authToken;
      const response = await api.get(`/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform to medical record format
      const appointment = response.data;
      const notes = appointment.notes || '';
      const diagnosisMatch = notes.match(/Chẩn đoán: (.+?)(?:\n|$)/);
      const clinicMatch = notes.match(/Phòng khám: (.+?)(?:\n|$)/);
      
      return {
        id: appointment.id,
        pet_id: appointment.pet_id,
        petName: appointment.petName,
        customer_id: appointment.customer_id,
        owner: appointment.customerName,
        date: appointment.appointment_date,
        diagnosis: diagnosisMatch ? diagnosisMatch[1] : 'Không có',
        service: appointment.service,
        clinic: clinicMatch ? clinicMatch[1] : 'Không có',
        notes: notes
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
          const errorMessage = axiosError.response.data?.message || 'Failed to fetch medical record details';
          throw new Error(errorMessage);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        }
      }
      throw new Error('An unknown error occurred while fetching medical record details.');
    }
  },
  
  // Update medical record
  updateMedicalRecord: async (id: number, data: MedicalRecord) => {
    try {
      const token = global.authToken;
      const response = await api.put(`/appointments/${id}`, {
        pet_id: data.pet_id,
        customer_id: data.customer_id,
        appointment_date: data.date,
        service: data.service,
        notes: `Chẩn đoán: ${data.diagnosis}\nPhòng khám: ${data.clinic}\n${data.notes || ''}`,
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