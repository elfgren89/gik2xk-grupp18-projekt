import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const userId = 1;
      const cart = await cartService.getCart(userId);
      setCartItems(cart.cartItems || []);
    } catch (error) {
      console.error('Fel vid hämtning av varukorgsdata:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const userId = 1;
      await cartService.addToCart({ userId, productId, quantity });
      fetchCart(); // uppdaterar varukorgen efter lyckad tilläggning
    } catch (error) {
      console.error('Fel vid tillägg av objekt i varukorgen:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      fetchCart(); // uppdaterar varukorgen efter lyckad borttagning
    } catch (error) {
      console.error('Fel vid borttagning av objekt i varukorgen:', error);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await cartService.updateCartItem({ cartItemId, quantity });
      fetchCart(); // uppdaterar varukorgen efter lyckad uppdatering
    } catch (error) {
      console.error('Fel vid uppdatering av varukorgen:', error);
    }
  };

  const clearCart = async () => {
    try {
      const userId = 1; // Antag att användarid 1 är inloggad användare
      await cartService.clearCart(userId);
      fetchCart(); // Uppdatera varukorgen efter lyckad rensning
    } catch (error) {
      console.error('Fel vid rensning av varukorgen:', error);
    }
  };

  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};