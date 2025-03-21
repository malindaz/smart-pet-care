import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('pharmacy_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [cartTotal, setCartTotal] = useState(0);

  // Update localStorage and calculate total whenever cart changes
  useEffect(() => {
    localStorage.setItem('pharmacy_cart', JSON.stringify(cart));

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  // Add item to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);

      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add new item with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart item count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Value to be provided
  const value = {
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;