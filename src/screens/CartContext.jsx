import React, { createContext, useState, useContext } from 'react';

// Create a Context for Cart
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// CartProvider component to wrap around your app to provide cart context
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add item to the cart or increase quantity if item already exists
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // If item already exists, increment the quantity
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      // Otherwise, add the item to the cart with quantity set to 1
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Remove item from the cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update the quantity of an item in the cart
  const updateItemQuantity = (id, quantity) => {
    if (quantity <= 0) return;  // Prevent negative or zero quantities

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
