import api from './apiService';

const petService = {
  getAllPets: async () => {
    try {
      const response = await api.getAllPets();
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPetById: async (id) => {
    try {
      const response = await api.getPet(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createPet: async (petData) => {
    try {
      const response = await api.createPet(petData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePet: async (id, petData) => {
    try {
      const response = await api.updatePet(id, petData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deletePet: async (id) => {
    try {
      const response = await api.deletePet(id);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getCustomerPets: async (customerId) => {
    try {
      const response = await api.getCustomerPets(customerId);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default petService;
