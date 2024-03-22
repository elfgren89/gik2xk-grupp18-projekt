import React, { useState, useEffect } from 'react';
import {
  Button,
  List,
  ListItem,
  Typography,
  Box,
  IconButton,
  TextField,
  Card,
  Grid,
  CardContent,
  CardActions,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { cartService } from '../services/cartService';
import { useCart } from '../contexts/CartContext';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// komponent för att rendera produkter i varukorgen
const CartItem = ({ item, onRemove, onQuantityChange }) => (
  
  // grid för produkt-card i varukorgen
  <Card variant='outlined' sx={{ mb: 2, overflow: 'hidden', boxShadow: 3 }}>
    <Grid container>

      {/* grid-item för produktens bild och titel */}
      <Grid
        item
        xs={4}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* bild på produkten */}
        <img
          src={item.product.imageUrl}
          alt={item.product.title}
          style={{ width: '100%', height: 'auto', maxWidth: '150px' }}
        />
      </Grid>

      {/* grid-item för produktinformation och kvantitetshanterare */}
      <Grid
        item
        xs={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* titel, pris och lagerstatus */}
        <CardContent>
          <Typography
            gutterBottom
            variant='h6'
            component='div'
            sx={{ fontWeight: 'medium', mb: 1 }}
          >
            {/* titel */}
            {item.product.title}
          </Typography>

          <Typography variant='body1' color='text.secondary'>
            {/* pris */}
            {item.product.price} kr
          </Typography>

          <Typography variant='body2' sx={{ color: 'limegreen', mt: 1 }}>
            {/* "lagerstatus" */}
            Finns i lager
          </Typography>
        </CardContent>
        
        {/* åtgärder för att hantera borttagning och kvantitet */}
        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>

           {/* knapp för att ta bort produkt från varukorgen */}
          <IconButton color='error' onClick={() => onRemove(item.id)}>
            <DeleteIcon />
          </IconButton>
          
          {/* kvantitetshanterare med knappar för att minska och öka kvantiteten */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => onQuantityChange(item, -1)}
              disabled={item.quantity <= 1}
            >
              <RemoveIcon />
            </IconButton>

            {/* textfält för att visa och ändra kvantiteten */}
            <TextField
              variant='outlined'
              size='small'
              value={item.quantity}
              onChange={(e) =>
                onQuantityChange(
                  item,
                  parseInt(e.target.value, 10) - item.quantity
                )
              }
              sx={{
                mx: 1,
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  minWidth: '35px',
                },
              }}
              InputProps={{
                inputProps: {
                  min: 1,
                  type: 'number',
                  style: { textAlign: 'right' },
                },
              }}
            />
            <IconButton onClick={() => onQuantityChange(item, 1)}>
              <AddIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Grid>
    </Grid>
  </Card>
);

// komponent för att hantera varukorgen och innehållet
const Cart = ({ toggleDrawer }) => {

  // samlar data och funktioner för varukorgen till anpassad react hook
  const { cartItems, setCartItems, removeFromCart, updateCartItem, clearCart } =
    useCart();

    // funktion för att hantera stängning varukorgs-drawer
  const handleCloseDrawer = () => {
    toggleDrawer('cart', false);
  };

  // funktion för att hantera borttagning av produkt från varukorgen
  const handleRemoveFromCart = async (cartItemId) => {
    removeFromCart(cartItemId);
  };

  // funktion för att hantera uppdatering av kvantitet i varukorgen
  const handleUpdateQuantity = (item, quantityDelta) => {
    const newQuantity = item.quantity + quantityDelta;
    if (newQuantity > 0) {
      updateCartItem(item.id, newQuantity);
    }
  };

  // funktion för att beräkna totala kostnaden för varukorgen
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.quantity * item.product.price, 0)
      .toFixed(2);
  };

  // container för varukorgen och innehållet
  return (
    <Box
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', p: 2 }}
    >
        {/* rubrik för varukorgen och stängningsknapp */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h6' gutterBottom>
          Din Varukorg (
          {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
        </Typography>
        <IconButton onClick={toggleDrawer} sx={{ padding: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      {/* avgränsare för listan */}
      <Divider sx={{ my: 2 }} />
      
      {/* lista för varje vara i varukorgen */}
      <List>
        {cartItems.map((item) => (
          <ListItem key={item.id} disableGutters>
            <CartItem
              item={item}
              onRemove={handleRemoveFromCart}
              onQuantityChange={handleUpdateQuantity}
            />
          </ListItem>
        ))}
        {/* meddelande om varukorgen är tom */}
        {cartItems.length === 0 && <Typography>Korgen är tom.</Typography>}
      </List>

      {/* container för totalpris & knappar i varukorgen */}
      <Box sx={{ mt: 2 }}>
        <Typography variant='h6'>Totalt: {calculateTotal()} kr</Typography>

        {/* knapp för 'gå till kassan' */}
        <Button
          variant='contained'
          color='primary'
          sx={{ 
            mt: 2, 
            backgroundColor: '#FF8000', // orange
            '&:hover': {
              backgroundColor: 'white',
              color: '#FF8000'
          },
            }}
          fullWidth
          onClick={() => alert('Check-Out funktionen är inte implementerad än.')}
        >
          Gå till kassan
        </Button>

        {cartItems.length > 0 && (
          
          // knapp för 'rensa kundvagnen'
          <Button
            variant='contained'
            color='primary'
            sx={{
              mt: 2,
              backgroundColor: '#FEBE34', // gul
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: '#FEBE34'
              },
            }}
            fullWidth
            onClick={() => {
              clearCart();
            }}
          >
            Rensa Kundvagnen
          </Button>
        )}
         
        {/* knapp för 'fortsätt handla' */}
        <Button
        variant='contained'
        color='primary'
        fullWidth
        onClick={toggleDrawer}

        sx={{  mt: 2, 
        backgroundColor: '#FF8000', // orange
        '&:hover': {
        backgroundColor: 'white',
        color: '#FF8000'
    },
  }}
>
  Fortsätt Handla
</Button>
    </Box>
    </Box>
  );
};

export default Cart;
