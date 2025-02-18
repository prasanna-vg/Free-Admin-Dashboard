import axios from 'axios';

const API_BASE_URL = 'http://35.225.43.56:3000/api/v1';
// const API_BASE_URL = 'http://localhost:3000/api/v1';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id: string, productData: FormData) => {
  try {
    console.log("reached updateProduct in apiService");
    console.log("id", id);
    console.log("product", productData);
    for (let pair of productData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteProduct = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchCategoriesWithSubcategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subcategories/grouped-by-category`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createCategory = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};
export const updateCategory = async (id: string, categoryData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
export const createSubCategory = async (subCategoryData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subcategories`, subCategoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchSubCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subcategories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubCategoryById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subcategories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubCategory = async (id: string, categoryData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/subcategories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteSubCategory = async (subCategoryId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/subcategories/${subCategoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }
};
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    console.log("orders -> ",response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchOrderById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (id: string, orderData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/analytics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUserAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/analytics/timeline`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchInventory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/inventory`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const fetchPickAndPack = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pick-pack`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pick and pack data:', error);
    throw error;
  }
};
export const updateDeliveryStatus = async (id: string, deliveryStatus: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pick-pack/${id}`, { deliveryStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating delivery status:', error);
    throw error;
  }
};

export const fetchDeliveryPartners = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/delivery-partners`);
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    throw error;
  }
};

export const addDeliveryPartner = async (partnerData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/delivery-partners`, partnerData);
    return response.data;
  } catch (error) {
    console.error('Error adding delivery partner:', error);
    throw error;
  }
};

export const updateDeliveryPartner = async (id: string, partnerData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/delivery-partners/${id}`, partnerData);
    return response.data;
  } catch (error) {
    console.error('Error updating delivery partner:', error);
    throw error;
  }
};

export const deleteDeliveryPartner = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delivery-partners/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting delivery partner:', error);
    throw error;
  }
};

export const fetchDeliveries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/delivery`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    throw error;
  }
};

export const addDelivery = async (deliveryData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/delivery`, deliveryData);
    return response.data;
  } catch (error) {
    console.error('Error adding delivery:', error);
    throw error;
  }
};

export const updateDelivery = async (id: string, deliveryData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/delivery/${id}`, deliveryData);
    return response.data;
  } catch (error) {
    console.error('Error updating delivery:', error);
    throw error;
  }
};

export const deleteDelivery = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delivery/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting delivery:', error);
    throw error;
  }
};

export const createPickAndPack = async (data: { orderId: string; orderType: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/pick-pack`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating pick and pack:', error);
    throw error;
  }
};
export const updatePickAndPack = async (id: string, data: { deliveryStatus: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/pick-pack/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating pick and pack:', error);
    throw error;
  }
};