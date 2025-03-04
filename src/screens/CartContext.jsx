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
    console.log("Adding item to cart:", item);
    console.log("Selected quantity:", item.selectedQuantity);
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // If item already exists, update the quantity by adding the new quantity
        console.log(`Item exists in cart. Current quantity: ${existingItem.quantity}`);
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.selectedQuantity }  // Add quantity correctly
            : cartItem
        );
      }
      // Otherwise, add the item to the cart with the selected quantity
      console.log(`Item does not exist in cart. Adding with quantity: ${item.quantselectedQuantityity}`);
      return [...prevCart, { ...item }];
    });
  };

  // Remove item from the cart
  const removeFromCart = (id) => {
    console.log(`Removing item with id: ${id}`);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update the quantity of an item in the cart
  const updateItemQuantity = (id, selectedQuantity) => {
    if (selectedQuantity <= 0) {
      console.log("Invalid quantity, cannot update to zero or negative.");
      return;  // Prevent negative or zero quantities
    }
    console.log(`Updating quantity for item with id: ${id} to ${selectedQuantity}`);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, selectedQuantity }  // Update item with the new quantity
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
