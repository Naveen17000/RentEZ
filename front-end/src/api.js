import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'https://rentez-w8lz.onrender.com/api'; // Update this if hosted elsewhere

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

// Fetch all available products
export const fetchAvailableProducts = async () => {
  try {
    console.log("Fetching available products from:", `${API_BASE_URL}/products/available`); // Debugging log
    const response = await api.get('/products/available');
    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching available products:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching available products.");
  }
};

export const fetchProduct = async (productId) => {
  try {
    console.log(`Fetching product with ID: ${productId}`); // Debugging log
    const response = await api.get(`/products/${productId}`);
    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }
    return response.data; // Return product data
  } catch (error) {
    console.error("Error fetching product:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching product.");
  }
};

// Fetch user's products (My Products)
export const fetchMyProducts = async () => {
  try {
    console.log("Fetching user's products from:", `${API_BASE_URL}/products/my-products`); // Debugging log
    const response = await api.get('/products/my-products'); // Remove extra '/api'
    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user's products:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching user's products.");
  }
};

// Sign up
export const signUp = async (username, email, password) => {
  try {
    // Sending user data to the server to create a new account
    const response = await api.post('/users/signup', { username, email, password });

    // Optionally, store the token if returned in the response (log the user in immediately after sign-up)
    const { token } = response.data;
    if (token) {
      sessionStorage.setItem('token', token);  // Store token in sessionStorage
      api.defaults.headers.Authorization = `Bearer ${token}`;  // Automatically set token for future requests
    }

    return response.data;  // Returning response data (user info or confirmation message)
  } catch (error) {
    // Handle sign-up errors gracefully
    console.error("Error during sign-up:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Sign-up failed.");
  }
};

// Sign in
export const signIn = async (email, password) => {
  try {
    const response = await api.post('/users/signin', { email, password });
    const { token } = response.data;

    if (token) {
      sessionStorage.setItem('token', token);  // Store token in sessionStorage
      api.defaults.headers.Authorization = `Bearer ${token}`;  // Automatically set token for future requests
    }

    return response.data;
  } catch (error) {
    console.error("Error during sign-in:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Sign-in failed.");
  }
};

// Create personal details
export const createPersonalDetails = async (details) => {
  try {
    const response = await api.post('/personal-details', details);
    return response.data;
  } catch (error) {
    console.error('Error creating personal details:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error creating personal details');
  }
};

// Fetch personal details
export const fetchPersonalDetails = async () => {
  try {
    const response = await api.get('/personal-details');
    return response.data;
  } catch (error) {
    console.error('Error fetching personal details:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error fetching personal details');
  }
};

// Update personal details
export const updatePersonalDetails = async (id, details) => {
  try {
    const response = await api.put(`/personal-details/${id}`, details);
    return response.data;
  } catch (error) {
    console.error('Error updating personal details:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error updating personal details');
  }
};


// Fetch all bank details for the authenticated user
export const fetchBankDetails = async () => {
  try {
    const response = await api.get('/bank-details');
    return response.data;
  } catch (error) {
    console.error("Error fetching bank details:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching bank details.");
  }
};

// Add new bank details
export const addBankDetails = async (bankData) => {
  try {
    const response = await api.post('/bank-details', bankData);
    return response.data;
  } catch (error) {
    console.error("Error adding bank details:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error adding bank details.");
  }
};

// Update existing bank details by ID
export const updateBankDetails = async (id, bankData) => {
  if (!id) {
    throw new Error("Bank details ID is required for updating.");
  }

  try {
    const response = await api.put(`/bank-details/${id}`, bankData);
    return response.data;
  } catch (error) {
    console.error("Error updating bank details:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error updating bank details.");
  }
};

// Delete bank details by ID
export const deleteBankDetails = async (id) => {
  if (!id) {
    throw new Error("Bank details ID is required for deletion.");
  }

  try {
    const response = await api.delete(`/bank-details/${id}`);
    return response.data; // Assuming the backend sends a confirmation message
  } catch (error) {
    const errorMessage = error?.response?.data?.message || error.message || "Error deleting bank details.";
    console.error("Error deleting bank details:", errorMessage);
    throw new Error(errorMessage);
  }
};



// Fetch all saved addresses
export const fetchAddresses = async () => {
  try {
    const response = await api.get('/addresses');
    return response.data;
  } catch (error) {
    console.error("Error fetching addresses:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching addresses.");
  }
};

// Add a new address
export const addAddress = async (addressData) => {
  try {
    const response = await api.post('/addresses', addressData);
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error adding address.");
  }
};

// Update an existing address
export const updateAddress = async (id, addressData) => {
  try {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error updating address.");
  }
};

export const deleteAddress = async (id) => {
  if (!id) {
    throw new Error("Address ID is required for deletion");
  }

  try {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;  // Assuming the backend sends some useful response here
  } catch (error) {
    // Enhanced error handling
    const errorMessage = error?.response?.data?.message || error.message || "Error deleting address.";
    console.error("Error deleting address:", errorMessage);
    throw new Error(errorMessage);  // Rethrow to let the caller handle it if needed
  }
};


export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error creating product.");
  }
};

// Function to update a product
export const updateProduct = async (productId, formData) => {
  if (!productId) {
    throw new Error("Product ID is required for updating");
  }

  try {
    const response = await api.put(`/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;  // Assuming the backend returns useful data after update
  } catch (error) {
    // Enhanced error handling
    const errorMessage = error?.response?.data?.message || error.message || "Failed to update product.";
    console.error("Failed to update product:", errorMessage);
    throw new Error(errorMessage);  // Rethrow to let the caller handle it if needed
  }
};



export const deleteProduct = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required for deletion");
  }

  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;  // Assuming the backend returns useful data after deletion
  } catch (error) {
    // Enhanced error handling
    const errorMessage = error?.response?.data?.message || error.message || "Failed to delete product.";
    console.error("Failed to delete product:", errorMessage);
    throw new Error(errorMessage);  // Rethrow to let the caller handle it if needed
  }
};

export const createRentalRequest = async (requestData) => {
  try {
    console.log("Creating rental request with data:", requestData); // Debugging log
    const response = await api.post('/products/rental-requests', requestData, {
      headers: {
        'Content-Type': 'application/json', // JSON format for rental requests
      },
    });
    console.log("Rental request created successfully:", response.data); // Debugging log
    return response.data; // Return the response data for success handling
  } catch (error) {
    console.error("Error creating rental request:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error creating rental request.");
  }
};

export const updateRentalRequestStatus = async (id, status) => {
  try {
    console.log("Sending update request:", { id, status });
    const response = await api.put(
      `/products/rental-requests/${id}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Ensure token is included
        },
      }
    );
    console.log("Update successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating rental request status:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.message || "Error updating rental request status.");
  }
};


export const fetchRentalRequests = async (filter = {}) => {
  try {
    console.log("Fetching rental requests with filter:", filter); // Debugging log
    const response = await api.get('/products/rental-requests', {
      params: filter, // Pass the filter object as query parameters
      headers: {
        'Content-Type': 'application/json', // Ensure request headers are set
      },
    });
    console.log("Fetched rental requests:", response.data); // Debugging log
    return response.data; // Return the response data on success
  } catch (error) {
    console.error("Error fetching rental requests:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching rental requests.");
  }
};

export const fetchRentalRequestsorders = async (filter = {}) => {
  try {
    console.log("Fetching rental requests with filter:", filter); // Debugging log
    const response = await api.get('/products/rental-requests/customer', {
      params: filter, // Pass the filter object as query parameters
      headers: {
        'Content-Type': 'application/json', // Ensure request headers are set
      },
    });
    console.log("Fetched rental requests:", response.data); // Debugging log
    return response.data; // Return the response data on success
  } catch (error) {
    console.error("Error fetching rental requests:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching rental requests.");
  }
};



export const getFavorite = async (equipmentId) => {
  try {
    const response = await api.get(`/favorites/${equipmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite status:", error);
    throw new Error(error?.response?.data?.message || "Error fetching favorite status");
  }
};

export const updateFavorite = async (equipmentId, isFavorite) => {
  try {
    const response = await api.post('/favorites', {
      equipmentId,
      isFavorite
    }); 
    return response.data;
  } catch (error) {
    console.error("Error updating favorite:", error);
    throw new Error(error?.response?.data?.message || "Error updating favorite");
  }
};

export const getAllFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw new Error(error?.response?.data?.message || "Error fetching favorites");
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error(error?.response?.data?.message || "Error fetching dashboard stats");
  }
};

// Fetch sales data
export const getSalesData = async () => {
  try {
    const response = await api.get('/sales-data');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw new Error(error?.response?.data?.message || "Error fetching sales data");
  }
};

// Fetch top products
export const getTopProducts = async () => {
  try {
    const response = await api.get('/top-products');
    return response.data;
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw new Error(error?.response?.data?.message || "Error fetching top products");
  }
};

// Fetch total sales
export const getTotalSales = async () => {
  try {
    const response = await api.get('/total-sales');
    return response.data;
  } catch (error) {
    console.error("Error fetching total sales:", error);
    throw new Error(error?.response?.data?.message || "Error fetching total sales");
  }
};

export const fetchPopularProducts = async () => {
  try {
    console.log("Fetching popular products from: /products/popular"); // Debugging log
    const response = await api.get('/products/popular'); // Use your configured axios instance (api)

    if (!response.headers['content-type'].includes('application/json')) {
      throw new Error('Received non-JSON response');
    }

    return response.data; // Assuming the backend response is an array of products
  } catch (error) {
    console.error("Error fetching popular products:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching popular products.");
  }
};

// Fetch related products by product ID
export const fetchRelatedProducts = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/related`);
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching related products.");
  }
};

export const fetchProductsByCategory = async (category, excludeProductId) => {
  try {
    const response = await fetch(`https://rentez-w8lz.onrender.com/api/products/category/${category}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// Fetch unavailable dates for a product
export const fetchUnavailableDates = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/unavailable-dates`);
    return response.data; // Assuming the backend returns an array of unavailable dates
  } catch (error) {
    console.error("Error fetching unavailable dates:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "Error fetching unavailable dates.");
  }
};