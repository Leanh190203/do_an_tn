import apiService from './apiService';

const dashboardService = {
  getDashboardStats: async () => {
    try {
      const response = await apiService.getDashboardStats();
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

export default dashboardService; 