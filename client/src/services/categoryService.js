import api from './api';

export const getCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Could not fetch categories', error);
    return [];
  }
};