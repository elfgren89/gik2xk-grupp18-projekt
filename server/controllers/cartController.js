const { Cart, CartItem, Product } = require('../models');

const CartController = {
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      let cart = await Cart.findOne({ where: { userId, completed: false } });
      if (!cart) {
        cart = await Cart.create({ userId });
      }
      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, productId },
      });
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await CartItem.create({ cartId: cart.id, productId, quantity });
      }

      res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  getCart: async (req, res) => {
    try {
      const { userId } = req.query;
      const cart = await Cart.findOne({
        where: { userId, completed: false },
        include: [
          {
            model: CartItem,
            as: 'cartItems',
            include: [
              {
                model: Product,
              },
            ],
          },
        ],
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { cartItemId } = req.body;
      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) {
        return res.status(404).send('CartItem not found');
      }
      await cartItem.destroy();
      res.status(200).send('CartItem removed');
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateCartItem: async (req, res) => {
    try {
      const { cartItemId, quantity } = req.body;
      const cartItem = await CartItem.findByPk(cartItemId);
      if (!cartItem) {
        return res.status(404).send('CartItem not found');
      }
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).send('CartItem updated');
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  clearCart: async (req, res) => {
    try {
      const { userId } = req.body;
      const cart = await Cart.findOne({ where: { userId, completed: false } });
      if (!cart) {
        return res.status(404).send('Cart not found');
      }
      await CartItem.destroy({ where: { cartId: cart.id } });
      res.status(200).send('Cart cleared');
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = CartController;
