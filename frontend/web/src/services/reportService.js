import apiService from './apiService';

const reportService = {
  getReportsData: async () => {
    try {
      const response = await apiService.getReportsData();
      return response;
    } catch (error) {
      console.error('Error fetching reports data:', error);
      throw error;
    }
  }
};

export default reportService; 