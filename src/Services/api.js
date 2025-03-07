import axios from 'axios';

const BASE_URL = 'https://suitsadmin.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Set a reasonable timeout to avoid hanging requests
  timeout: 30000
});

// Remove duplicate token adding since we have interceptors
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Prevent infinite refresh loops
    if (originalRequest._retry) {
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      
      if (refresh) {
        try {
          const response = await axios.post(`${BASE_URL}/users/token/refresh/`, {
            refresh
          });
          
          // Update stored token
          localStorage.setItem('access_token', response.data.access);
          
          // Update auth header
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          
          // Retry the original request
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.clear();
          window.location.href = '/login?expired=true';
          return Promise.reject(error);
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    // Handle other errors normally
    return Promise.reject(error);
  }
);

// ✅ Corrected Named Exports
export const registerUser = async (userData) => {
  const response = await api.post('/users/register/', userData);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/inventory/categories/');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/inventory/categories/', categoryData);
  return response.data;
};

// Product API functions
export const getProducts = async () => {
  const response = await api.get('/inventory/products/');
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/inventory/products/', productData);
  return response.data;
};

export const updateProduct = async (id, updatedData) => {
  const response = await api.put(`/inventory/products/${id}/`, updatedData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/inventory/products/${id}/`);
  return response.data;
};

// Sale API functions
export const createSale = async (saleData) => {
  const response = await api.post('/sale/sales/', saleData);
  return response.data;
};

export const getSales = async () => {
  const response = await api.get('/sale/sales/');
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await api.get(`sale/sales/${id}/`);
  return response.data;
};

export const updateSaleStatus = async (saleId, status) => {
  try {
    const response = await api.patch(`/sale/sales/${saleId}/`, { status });
    return response.data;
  } catch (error) {
    console.error("Failed to update sale status:", error);
    throw error;
  }
};

export const generateInvoice = async (saleId) => {
  try {
    const response = await api.get(`/sale/sales/${saleId}/invoice/`);
    return response.data;
  } catch (error) {
    console.error('Failed to generate invoice:', error);
    throw error;
  }
};

// Table API functions
// export const fetchTables = () => fetchData("/table/tables/");
// export const createTable = (tableData) => fetchData("/table/tables/", "POST", tableData);



// Exchange Rate API
export const fetchExchangeRates = async () => {
  const response = await api.post('/fetch-exchange-rates/');
  return response.data;
};

// Sales Reports API
export const getSalesReports = async () => {
  const response = await api.get('sale/sales-report/');
  return response.data;
};

export const createStockMovement = async (movementData) => {
  try {
    const response = await api.post("/inventory/stock-movement/", movementData);
    return response.data;
  } catch (error) {
    console.error("Failed to create stock movement:", error);
    throw error;
  }
};

// RESTAURANT FUNCTIONS.
export const tableAPI = {
  fetchTables: async () => {
    const response = await api.get('/table/tables/');
    return response.data;
  },
  createTable: async (tableData) => {
    const response = await api.post('/table/tables/', tableData);
    return response.data;
  },
  updateTable: async (id, updatedData) => {
    const response = await api.patch(`/table/tables/${id}/`, updatedData);
    return response.data;
  },
  resetTable: async (id) => {
    const response = await api.post(`/table/tables/${id}/reset/`);
    return response.data;
  },
};

export const reservationAPI = {
  fetchReservations: async () => {
    const response = await api.get('/table/reservations/');
    return response.data;
  },
  createReservation: async (reservationData) => {
    const response = await api.post('/table/reservations/', reservationData);
    return response.data;
  },
  updateReservation: async (id, updatedData) => {
    const response = await api.patch(`/table/reservations/${id}/`, updatedData);
    return response.data;
  },
  deleteReservation: async (id) => {
    const response = await api.delete(`/table/reservations/${id}/`);
    return response.data;
  },
};

export const saleAPI = {
  createSale: async (saleData) => {
    const response = await api.post('/sale/sales/', saleData);
    return response.data;
  },
  fetchSales: async () => {
    const response = await api.get('/sale/sales');
    return response.data;
  },
  fetchSaleById: async (id) => {
    const response = await api.get(`/sale/sales/${id}/`);
    return response.data;
  },
  updateSaleStatus: async (id, status) => {
    const response = await api.patch(`/sale/sales/${id}/`, { status });
    return response.data;
  },
  splitBill: async (saleId, splitData) => {
    const response = await api.post(`/sale/${saleId}/split-bill/`, splitData);
    return response.data;
  },
};

export const getBillSplits = async (saleId) => {
  const response = await api.get(`/table/sales/${saleId}/bill-splits/`);
  return response.data;
};


export const splitBill = async (saleId, splitData) => {
  const response = await api.post(`table/sales/${saleId}/split-bill/`, splitData);
  return response.data;
};
export const fetchKitchenOrders = async () => {
  try {
    const response = await api.get('/table/kitchen-orders/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch kitchen orders:', error);
    throw error;
  }
};

export const fetchBarOrders = async () => {
  try {
    const response = await api.get('/table/bar-orders/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bar orders:', error);
    throw error;
  }
};


export const invoiceAPI = {
  generateInvoice: async (tableId) => {
    const response = await api.get(`/table/tables/${tableId}/generate-invoice/`);
    return response.data;
  },
  fetchInvoiceById: async (invoiceId) => {
    const response = await api.get(`/table/invoices/${invoiceId}/`);
    return response.data;
  },
};

export const handleCompleteOrder = async (id, fetchOrders) => {
  try {
    await orderAPI.completeOrder(id);
    fetchOrders(); // Refresh the order list
  } catch (err) {
    alert("Failed to complete order.");
  }
};

// 🟠 Cancel an order
export const handleCancelOrder = async (id, fetchOrders) => {
  try {
    await orderAPI.cancelOrder(id);
    fetchOrders(); // Refresh the order list
  } catch (err) {
    alert("Failed to cancel order.");
  }
};

// 🟡 Generate an invoice
export const handleGenerateInvoice = async (tableId, setInvoice, setError) => {
  try {
    const data = await invoiceAPI.generateInvoice(tableId);
    setInvoice(data);
  } catch (err) {
    setError(err.response?.data?.error || "Failed to generate invoice.");
  }
};


// END OF RESTAURANT FUNCTIONS



// 🟡 Generate an invoice


// END OF RESTAURANT FUNCTIONS
export const getUsers = async () => {
  const response = await api.get("/users/users");
  return response.data;
};

export const authAPI = {
  async login(credentials) {
    try {
      const response = await api.post('/users/token/', credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.detail || 'Login failed. Please check your credentials.'
        };
      } else {
        throw {
          status: 0,
          message: 'Network error. Please check your connection.'
        };
      }
    }
  },
  logout() {
    localStorage.clear();
    window.location.href = '/login';
  },
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};

export default api;