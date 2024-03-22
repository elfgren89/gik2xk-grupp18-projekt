import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { useProducts } from '../contexts/ProductContext';
import AddProductModal from '../components/AddProductModal';
import { getCategories } from '../services/productService';
import ProductBreadcrumbs from '../components/ProductBreadcrumbs';
import { Container, Box } from '@mui/material';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { products, fetchProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filterProductsByCategory = async () => {
      const categories = await getCategories();
      const category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

      if (category) {
        const categoryFilteredProducts = products.filter(product => product.categoryId === category.id);
        setFilteredProducts(categoryFilteredProducts);
      } else {
        console.error(`Category ${categoryName} not found`);
        setFilteredProducts([]);
      }
    };

    filterProductsByCategory();
  }, [categoryName, products]);

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchProducts();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 2 }}>
        <ProductBreadcrumbs category={categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} />
      </Box>
      <h2>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h2>
      <ProductGrid products={filteredProducts} />
      <AddProductModal open={openModal} handleClose={handleCloseModal} onAddProduct={fetchProducts} />
    </Container>
  );
};

export default CategoryPage;
