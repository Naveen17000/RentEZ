import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'https://rentez-2quq.onrender.com/api'; // Update this if hosted elsewhere

// Configure Axios instance with a base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage
    console.log('Token in Interceptor:', token); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchUserCount = async () => {
  try {
    console.log("Fetching user count from: /admin/user-count"); // Debugging log
    const response = await api.get('/admin/user-count');
    
    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }
    
    return response.data.count; // Assuming the backend response is { count: <number> }
  } catch (error) {
    console.error("Error fetching user count:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching user count.");
  }
};

export const fetchSalesCount = async () => {
  try {
    console.log("Fetching sales count from: /admin/sales/count"); // Debugging log
    const response = await api.get('/admin/sales/count'); // Use your configured axios instance (api)

    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }

    return response.data.count; // Assuming the backend response is { count: <number> }
  } catch (error) {
    console.error("Error fetching sales count:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching sales count.");
  }
};

export const fetchRecentSales = async () => {
  try {
    console.log("Fetching recent sales from: /admin/sales/recent"); // Debugging log
    const response = await api.get('/admin/sales/recent');
    
    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }
    
    return response.data; // Return the array of recent sales
  } catch (error) {
    console.error("Error fetching recent sales:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching recent sales.");
  }
};

export const fetchTopProducts = async () => {
  try {
    console.log("Fetching top products from: /admin/products/top"); // Debugging log
    const response = await api.get('/admin/products/top'); // Use your configured axios instance (api)

    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }

    return response.data; // Assuming the backend response is an array of products
  } catch (error) {
    console.error("Error fetching top products:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching top products.");
  }
};

export const fetchRevenue = async () => {
  try {
    console.log("Fetching revenue data from: /admin/products/revenue");
    const response = await api.get('/admin/products/revenue');

    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }

    return response.data.revenue;
  } catch (error) {
    console.error("Error fetching revenue:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching revenue.");
  }
};

export const fetchUserCountForMonth = async () => {
  try {
    console.log("Fetching user count for the current month from: /admin/user-count-month");
    const response = await api.get('/admin/user-count-month');

    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }

    return response.data.count;
  } catch (error) {
    console.error("Error fetching user count for the current month:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching user count for the current month.");
  }
};

// Fetch recent activities
export const fetchRecentActivities = async () => {
  try {
      console.log('Fetching recent activities...');
      const response = await api.get('/admin/activities/recent');
      console.log('Received activities:', response.data); // Debug response
      return response.data;
  } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
  }
};

