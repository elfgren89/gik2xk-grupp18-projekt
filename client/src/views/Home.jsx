import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import ProductGrid from '../components/ProductGrid';
import AddProductModal from '../components/AddProductModal';
import { useProducts } from '../contexts/ProductContext';
import { Box, Typography, Container } from '@mui/material';
import { getProductAverageRating } from '../services/productService';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Home = ({ setTheme }) => {
  const { products, fetchProducts } = useProducts();
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const calculateAndSetTopSelling = async () => {
      // Loggar antal produkter innan någon filtrering.
      console.log(`Totala produkter att bedöma: ${products.length}`);
      
      const productsWithRatings = await Promise.all(products.map(async product => {
        try {
          const averageRatingData = await getProductAverageRating(product.id);
          // Om inget betyg finns, ange ett defaultvärde som 0.
          const averageRating = averageRatingData.averageRating || 0;
          return { ...product, averageRating };
        } catch (error) {
          console.error(`Kunde inte hämta genomsnittsbetyg för produkt ${product.title}:`, error);
          return { ...product, averageRating: 0 }; // Anta att betyget är 0 om vi inte kan hämta det.
        }
      }));
  
      // Loggar produkter med deras betyg.
      console.log('Produkter med betyg:', productsWithRatings);
  
      // Sortera produkter baserat på betyg, ta bara med de som har ett betyg.
      const sortedProducts = productsWithRatings
        .filter(product => product.averageRating > 0)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 9);
  
      setTopSellingProducts(sortedProducts);
    };
  
    if (products.length > 0) {
      calculateAndSetTopSelling();
    }
  }, [products]);

  const handleCloseModal = () => {
    setOpenModal(false);
    fetchProducts(); // Hämta produktlistan på nytt när modalen stängs.
  };

  return (
    <>
  <Container maxWidth="lg">
    {/* Använd Container för att definiera en maxbredd */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 3, maxWidth: 1200, margin: 'auto' }}>
      {/* Rubrik och centrering till vänster */}
      <Box sx={{ pt: 2, pb: 2, display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        <Typography variant="h4" gutterBottom 
          sx={{ 
          flexGrow: 1, 
          textAlign: 'left', 
          marginTop: 1.5, 
          marginLeft: 2, 
          marginBottom: 0, 
          color: '#FF71BE',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          >
          Toppsäljare
          <AutoAwesomeIcon sx={{ color: '#FEBE34', margin: 1 }} />
        </Typography>
      </Box>
      {/* Produktgalleriet för toppsäljare */}
      <ProductGrid products={topSellingProducts} />
    </Box>
    {/* Modal för att lägga till produkter */}
    <AddProductModal open={openModal} handleClose={handleCloseModal} onAddProduct={fetchProducts} />
  </Container>
</>
  );
};

export default Home;
