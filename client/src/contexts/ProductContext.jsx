import React, { createContext, useState, useContext } from 'react';
import { getProductList } from '../services/productService';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const productList = await getProductList();
    setProducts(productList);
  };

  return (
    <ProductContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
