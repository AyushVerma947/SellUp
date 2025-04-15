import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity , ActivityIndicator } from 'react-native';
import { useCart } from './CartContext';  // Import the custom hook to access cart context

const CartScreen = () => {

  const [cheapestProduct, setCheapestProduct] = useState(null);
  const [loading, setLoading] = useState(true);  // Define loading state here
  const [error, setError] = useState(false);

  const { cart, removeFromCart, updateItemQuantity } = useCart();  // Access the cart state and methods

  // Function to calculate the total amount
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.selectedQuantity, 0).toFixed(2);
  };

  // Function to handle the quantity update, ensuring it doesn't exceed the available stock
  const handleUpdateQuantity = (itemId, currentQuantity, increase) => {
    const item = cart.find(i => i.id === itemId);
    
    // Check available stock (assuming `item.stock` holds the available stock)
    if (increase) {
      // Allow increase only if quantity is less than stock
      if (currentQuantity < item.quantity) {
        updateItemQuantity(itemId, currentQuantity + 1);
      } else {
        alert('You cannot add more than the available stock.');
      }
    } else {
      // Decrease quantity but ensure it doesn't go below 1
      if (currentQuantity > 1) {
        updateItemQuantity(itemId, currentQuantity - 1);
      }
    }
  };

  useEffect(() => {
    const fetchCheapestProduct = async () => {
      try {
        const response = await fetch('https://sweet-snow-e8dc.vayush947.workers.dev/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const product = await response.json();  // Parse the response as JSON
        console.log(product);  // Log the product data for debugging
        setCheapestProduct(product);  // Store product in state
        // console.log("hja")
      } catch (error) {
        console.error('Error fetching product data:', error);  // Log the error if it occurs
        setError('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCheapestProduct();
  }, []);
  
  
  // Render cheapest product
  const renderCheapestProduct = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#007bff" />;
    }
  
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
  
    if (cheapestProduct) {
      // Extract fields from the fetched product
      const productData = cheapestProduct.fields;
      const productName = productData.name.stringValue;
      const productImage = productData.image.stringValue;
      const productPrice = parseFloat(productData.price.stringValue).toFixed(2);  // Convert price to a float and format
      const productCondition = productData.condition.stringValue;
      const productColor = productData.color.stringValue;
      const productQuantity = productData.quantity.integerValue;
      
      return (
        <View style={styles.cheapestProductContainer}>
          <Text style={styles.cheapestProductTitle}>Cheapest Product</Text>
          <Image source={{ uri: productImage }} style={styles.productImage} />
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.productPrice}>${productPrice}</Text>
          <Text style={styles.productCondition}>Condition: {productCondition}</Text>
          <Text style={styles.productColor}>Color: {productColor}</Text>
          <Text style={styles.productQuantity}>Quantity: {productQuantity}</Text>
        </View>
      );
    }
  
    return <Text>No product found.</Text>;
  };
  
  // Render cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
        
        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.selectedQuantity, false)} // Decrease quantity
            disabled={item.quantity <= 1}  // Disable decrement if quantity is 1
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.cartItemQuantity}>Quantity: {item.selectedQuantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.selectedQuantity, true)} // Increase quantity
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.cartTitle}>Your Cart</Text>
      
      {cart.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty!</Text>
      ) : (
        <FlatList 
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={item => item.id.toString()}
        />
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
      </View>

      {cart.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
      {renderCheapestProduct()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  cartTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 16,
    color: 'gray',
  },
  cartItemQuantity: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  removeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 15,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cheapestProductContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cheapestProductTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#28a745',
    marginBottom: 5,
  },
  productCondition: {
    fontSize: 14,
    marginBottom: 5,
  },
  productColor: {
    fontSize: 14,
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default CartScreen;
