import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductAverageRating } from '../services/productService';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ProductRating from './ProductRating';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCart } from '/src/contexts/CartContext';

// komponent för att rendera produktkort med produktinformation och knappar
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
  const starSize = matchesSM ? 'small' : 'medium';
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // Toggla tillståndet för isFavorite när användaren klickar på hjärtat
  };

  // effektfunktion för att hämta den genomsnittliga produktrankingen
  useEffect(() => {
    getProductAverageRating(product.id)
      .then((averageRatingData) => {
        const avgRating = parseFloat(averageRatingData.averageRating);
        setAverageRating(avgRating || 0);
      })
      .catch((error) => {
        console.error('Could not fetch product average rating', error);
      });
  }, [product.id]);

  // funktion för att lägga till produkt i varukorgen
  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1); // antar att 1 är kvantiteten användaren vill lägga till
      alert('Produkt tillagd i varukorgen!');
    } catch (error) {
      console.error(
        'Misslyckades att lägga till produkt i varukorgen',
        error
      );
      alert('Ett fel uppstod när produkten skulle läggas till i varukorgen.');
    }
  };

   // hanterar klick på produktkort (navigerar till produktsida)
  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  // kortkomponent för att visa produktinformation och knappar
  return (
    <Card
      sx={{
        minWidth: matchesSM ? 150 : 150, // under 600px (v), över 600px (h), small
        maxWidth: matchesSM ? 150 : 345, // under 600px (v), över 600px (h), small
        width: '100%',
        mb: 2,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* navigerar till produktsidan när man klickar på kortet */}
      <CardActionArea onClick={handleCardClick}>

        {/* media för produktbild */}
        <CardMedia
          component='img'
          sx={{ height: matchesSM ? 140 : 240, objectFit: 'contain' }}
          image={product.imageUrl}
          alt={product.title}
        />

        {/* innehåll produkt titel */}
        <CardContent sx={{ pl: 2, pb: '0' }}>
          <Box
            onClick={handleCardClick}
            sx={{
              display: 'block',
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >

            {/* rubrik för produkten */}
            <Typography
              gutterBottom
              variant={matchesSM ? 'subtitle1' : 'h5'}
              component='div'
            >
              {product.title}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* utseende för pris och betyg */}
      <Box sx={{ mt: 'auto', px: 2, pb: 0 }}> {/* Minskar padding här */}
        <Typography
          sx={{ fontWeight: 'bold', display: 'block' }}
          variant={matchesSM ? 'body2' : 'h6'}
        >
          {product.price} kr
        </Typography>

        {/* renderar produktbetyget */}
        <ProductRating ratingValue={averageRating} size={starSize} />
      </Box>

      {/* utseende och ikoner för favorit och kundvagn */}
      <CardActions disableSpacing sx={{ justifyContent: 'space-between', p: 1 }}> {/* Minskar padding här */}
        <IconButton aria-label='add to favorites' onClick={toggleFavorite}>
          {isFavorite ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />} {/* favoritikon */}
        </IconButton>
        <IconButton aria-label='add to shopping cart' onClick={handleAddToCart}>
          <ShoppingCartIcon sx={{ color: '#FF8000', '&:hover': {
            color: '#FEBE34'}, }} /> {/* varukorgsikon */}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
