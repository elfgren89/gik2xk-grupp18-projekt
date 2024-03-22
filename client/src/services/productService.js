import api from './api';

export const getProductList = async () => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Could not fetch products', error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Could not fetch product with id ${id}`, error);
    return null;
  }
};
export const getCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Could not fetch categories', error);
    return [];
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await api.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Could not create product', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  const formData = new FormData();

  Object.keys(productData).forEach((key) => {
    if (key !== 'file') {
      formData.append(key, productData[key]);
    }
  });

  if (productData.file) {
    formData.append('image', productData.file);
  }

  try {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Could not update product with id ${id}`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/api/products/${id}`);
  } catch (error) {
    console.error(`Could not delete product with id ${id}`, error);
    throw error;
  }
};

// funktioner för att hantera betyg
export const addRatingToProduct = async (productId, rating) => {
  try {
    // anpassning för att matcha den korrekta endpointen för att lägga till betyg
    const response = await api.post(
      `/api/products/${productId}/ratings`,
      rating
    );
    if (!response.data) {
      throw new Error('Failed to add rating');
    }
    return response.data;
  } catch (error) {
    console.error('Could not add rating to product:', error);
    throw error;
  }
};

export const getProductRatings = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}/ratings`);
    return response.data;
  } catch (error) {
    console.error(
      `Could not get ratings for product with id ${productId}`,
      error
    );
    throw error;
  }
};

export const getProductAverageRating = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}/averageRating`);
    return response.data;
  } catch (error) {
    console.error(
      `Could not get average rating for product with id ${productId}`,
      error
    );
    throw error;
  }
};