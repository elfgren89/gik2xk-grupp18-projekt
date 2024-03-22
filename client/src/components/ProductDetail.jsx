import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useProducts } from '/src/contexts/ProductContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
  TextField,
  Grid,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  getProductById,
  addRatingToProduct,
  getProductRatings,
  getProductAverageRating,
} from '../services/productService';
import ProductRating from './ProductRating';
import RatingsDialog from './RatingsDialog';
import { useCart } from '/src/contexts/CartContext';

// funktion för att visa produktinformation
function ProductDetail() {
  const { id } = useParams();
  const { products, fetchProducts } = useProducts(); // Använd din context-hook här
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentRating, setCurrentRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const { addToCart } = useCart();
  const [ratingsDialogOpen, setRatingsDialogOpen] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);

  // effektfunktion för att hämta produktinformation baserat på id
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
  
        // hämtar och beräknar genomsnittsbetyg för produkten
        const ratingsData = await getProductRatings(id);
        const total = ratingsData.length;
        const sumOfRatings = ratingsData.reduce((acc, rating) => acc + rating.rating, 0);
        const average = total ? sumOfRatings / total : 0;
  
        // uppdaterar state med den hämtade betygsinformationen
        setCurrentRating(average);
        setTempRating(average);
        setTotalRatings(total);
        setRatings(ratingsData);
      } catch (error) {
        console.error('Could not fetch product details', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // hämtar produktinformation
    fetchProductDetails();
  }, [id, products]);

  // funktion för att hantera ändringar i produktens betyg
  const handleRatingChange = async (newValue) => {
    setTempRating(newValue); // temporärt sättning av det nya betyget
    try {
      const addResponse = await addRatingToProduct(id, { rating: newValue });
      if (addResponse.message === 'Rating added successfully') {
        const updatedRatingResponse = await getProductAverageRating(id);
        setCurrentRating(parseFloat(updatedRatingResponse.averageRating)); // ser till att detta är ett nummer
        setRatings((prevRatings) => [...prevRatings, { rating: newValue }]);
        setTotalRatings((prevTotal) => prevTotal + 1); // uppdaterar det totala antalet omdömen
      } else {
        throw new Error('Invalid response');
      }
      alert('Tack för ditt betyg!');
    } catch (error) {
      console.error('Failed to add rating', error);
      setTempRating(currentRating);
    }
  };

  // funktion för att hantera tillägg i varukorgen
  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
      alert('Produkt tillagd i varukorgen!');
    } catch (error) {
      console.error('Failed to add product to cart', error);
    }
  };

  // visar laddningsindikator
  if (!product) {
    return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
    <CircularProgress />
    </Box>
    );
    }

  // visar meddelande om ingen produkt hittas
  if (!product) {
    return (
      <Typography variant='h5' textAlign='center'>
        Product not found.
      </Typography>
    );
  }

  // returnerar visning av produktinformation och betyg
  return (
    <Box display='flex' justifyContent='center' p={3}>
      <Card sx={{ maxWidth: 1200, width: '100%' }}>
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems='start'
          justifyContent='center'
        >
          <CardMedia
            component='img'
            sx={{ width: { xs: '100%', md: 360 }, height: 'auto' }}
            image={
              product.imageUrl.startsWith('http')
                ? product.imageUrl
                : `http://localhost:3001${product.imageUrl}`
            }
            alt={product.title}
          />
          <CardContent>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize='small' />}
              aria-label='breadcrumb'
            >
              <Link
                underline='hover'
                color='inherit'
                component={RouterLink}
                to='/'
              >
                Hem
              </Link>
              {product.category && (
                <Link
                  underline='hover'
                  color='inherit'
                  component={RouterLink}
                  to={`/category/${product.category.name}`}
                >
                  {product.category.name}
                </Link>
              )}
              <Typography color='text.primary'>{product.title}</Typography>
            </Breadcrumbs>

            <Typography gutterBottom variant='h5' component='div'>
              {product.title}
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              {product.description}
            </Typography>

            <Typography variant='h6' sx={{ my: 2 }}>
              {product.price} kr
            </Typography>

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ProductRating
                ratingValue={tempRating}
                readOnly={false}
                onRatingChange={handleRatingChange}
                size='large'
              />

              <Typography component='span' sx={{ ml: 2 }}>
                {currentRating ? currentRating.toFixed(1)  : 'Inget betyg'}&nbsp;
              </Typography>

              <Link
                component='button'
                onClick={() => setRatingsDialogOpen(true)}
                sx={{ ml: 1, p: 0, minWidth: 0 }}
              >
                ({totalRatings} omdömen)
              </Link>

            </Box>

            {/* grid för val av antal och knapp för att lägga till i varukorgen */}
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <TextField
                  label='Antal'
                  type='number'
                  InputProps={{ inputProps: { min: 1 } }}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </Grid>
              <Grid item>

                {/* knapp för att lägga till i varukorgen */}
                <Button
                  onClick={handleAddToCart}
                  variant='contained'
                  color='primary'
                  sx={{ 
                    mt: 2, 
                    backgroundColor: '#FF8000', //orange knapp
                    '&:hover': {
                      backgroundColor: 'white',
                      color: '#FF8000'
                    },
                  }}
                >
                  Lägg till i varukorg
                </Button>

              </Grid>
            </Grid>
          </CardContent>
        </Box>
      </Card>

      {/* dialog för betyg */}
      <RatingsDialog
        open={ratingsDialogOpen}
        onClose={() => setRatingsDialogOpen(false)}
        ratings={ratings}
        averageRating={currentRating} 
      />
    </Box>
  );
}

export default ProductDetail;
