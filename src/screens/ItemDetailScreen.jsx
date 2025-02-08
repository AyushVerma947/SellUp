import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { useCart } from './CartContext';  // Import the custom hook to access cart context

const ItemDetailScreen = ({ route }) => {
  const { item } = route.params;  // Destructure item from route.params
  const { cart, addToCart } = useCart(); // Access cart state and addToCart function from context
  const [buttonText, setButtonText] = useState("Add to Cart");

  // Function to handle the Add to Cart action
  const handleAddToCart = () => {
    // Check if the item already exists in the cart
    const isItemInCart = cart.some(cartItem => cartItem.id === item.id);

    if (!isItemInCart) {
      addToCart(item);  // Add the item to the cart
      setButtonText("Added to Cart");  // Update the button text
      
    }
    navigation.navigate('ItemDetail', { item: item });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>

      <Text style={styles.itemDetailLabel}>Company:</Text>
      <Text style={styles.itemDetail}>{item.company}</Text>

      <Text style={styles.itemDetailLabel}>Condition:</Text>
      <Text style={styles.itemDetail}>{item.condition}</Text>

      <Text style={styles.itemDetailLabel}>Color:</Text>
      <Text style={styles.itemDetail}>{item.color}</Text>

      <Text style={styles.itemDetailLabel}>Years Used:</Text>
      <Text style={styles.itemDetail}>{item.years_used}</Text>

      <Text style={styles.itemDescription}>Description: Detailed item description here.</Text>

      {/* Add to Cart Button */}
      <Button 
        title={buttonText} 
        onPress={handleAddToCart}  // Handle add to cart action
        disabled={buttonText === "Added to Cart"}  // Disable the button once added
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  itemImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 10,
  },
  itemDetailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemDetail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
  },
});

export default ItemDetailScreen;
