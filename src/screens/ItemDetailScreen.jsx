import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, Button, TextInput, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { useCart } from './CartContext';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const ItemDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;  
  const { cart, addToCart, updateItemQuantity } = useCart(); 
  const [buttonText, setButtonText] = useState("Add to Cart");
  const [selectedQuantity, setSelectedQuantity] = useState(1); 
  const [sellerId, setSellerId] = useState(null);  // Store Seller ID
  const [sellerName, setSellerName] = useState("Loading...");

  const currentUser = auth().currentUser; // Get logged-in user (buyer)

  const isItemInCart = cart.some(cartItem => cartItem.id === item.id);

  useEffect(() => {
    if (isItemInCart) {
      setButtonText("Update Quantity");
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      setSelectedQuantity(existingItem.selectedQuantity);
    }
  }, [cart, isItemInCart, item.id]);

  // Fetch Seller ID from Firestore using Seller Email
  useEffect(() => {
    const fetchSellerId = async () => {
      if (!item.sellerEmail) return; // Ensure sellerEmail exists
  
      try {
        console.log("Fetching seller ID for:", item.sellerEmail);
  
        const usersRef = firestore().collection("users");
        const querySnapshot = await usersRef.where("email", "==", item.sellerEmail).get();
  
        if (!querySnapshot.empty) {
          const sellerDoc = querySnapshot.docs[0]; // Fetch first matching document
          setSellerId(sellerDoc.id);  
          console.log("Seller ID fetched:", sellerDoc.id);
        } else {
          console.warn("No seller found with email:", item.sellerEmail);
        }
      } catch (error) {
        console.error("Error fetching seller ID:", error);
      }
    };
  
    fetchSellerId();
  }, [item.sellerEmail]);
  
  // Handle Add to Cart
  const handleAddToCart = () => {
    if (isItemInCart) {
      updateItemQuantity(item.id, selectedQuantity);
    } else {
      addToCart({ ...item, selectedQuantity });
    }
    navigation.goBack();
  };

  // Handle Quantity Change
  const handleQuantityChange = (squantity) => {
    if (squantity >= 1 && squantity <= item.quantity) {
      setSelectedQuantity(squantity);
    }
  };

  // Navigate to Chat Screen
  const handleChat = async () => {
    try {
      console.log("Current User:", currentUser);
      console.log("Item:", item);
  
      if (!currentUser || !item.seller) {
        Alert.alert("Error", "Unable to start chat. Try again later.");
        return;
      }
  
      const usersRef = firestore().collection("users");
      const querySnapshot = await usersRef.where("email", "==", item.seller).get();
  
      if (!querySnapshot.empty) {
        const sellerDoc = querySnapshot.docs[0]; // Fetch first matching document
        const sellerId = sellerDoc.id;
        console.log("Seller ID fetched:", sellerId);
  
        // Navigate after fetching seller ID
        navigation.navigate("ChatScreen", {
          user1: currentUser.uid, // Buyer (Logged-in User)
          user2: sellerId,  // Seller (Fetched from Firestore)
        });
      } else {
        console.warn("No seller found with email:", item.seller);
        Alert.alert("Error", "Seller not found.");
      }
    } catch (error) {
      console.error("Error fetching seller ID:", error);
      Alert.alert("Error", "Something went wrong. Try again later.");
    }
  };
  
  useEffect(() => {
    const fetchSellerName = async () => {
      try {
        const usersRef = firestore().collection("users");
        const querySnapshot = await usersRef.where("email", "==", item.seller).get();

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data(); // Get first document data
          setSellerName(userData.name || "Unknown Seller"); // If name exists, set it
        } else {
          setSellerName("Unknown Seller");
        }
      } catch (error) {
        console.error("Error fetching seller name:", error);
        setSellerName("Unknown Seller");
      }
    };

    fetchSellerName();
  }, [item.seller]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

        <Text style={styles.itemDetailLabel}>Available Quantity:</Text>
        <Text style={styles.itemDetail}>{item.quantity}</Text>

        <Text style={styles.itemDetailLabel}>Seller:</Text>
        <Text style={styles.itemDetail}>{sellerName}</Text>

        {/* Quantity Selector */}
        <Text style={styles.itemDetailLabel}>Select Quantity:</Text>
        <View style={styles.quantityContainer}>
          <Button
            title="-"
            onPress={() => handleQuantityChange(selectedQuantity - 1)}
            disabled={selectedQuantity <= 1}
          />
          <TextInput
            style={styles.quantityInput}
            value={String(selectedQuantity)}
            onChangeText={(text) => handleQuantityChange(parseInt(text) || 1)}
            keyboardType="numeric"
          />
          <Button
            title="+"
            onPress={() => handleQuantityChange(selectedQuantity + 1)}
            disabled={selectedQuantity >= item.quantity}
          />
        </View>

        <Text style={styles.itemDescription}>Description: Detailed item description here.</Text>

        {/* Add to Cart Button */}
        <Button 
          title={buttonText} 
          onPress={handleAddToCart}
          disabled={buttonText === "Added to Cart" && !isItemInCart}
        />

        {/* Chat Button */}
        {/* <View style={{ marginTop: 10 }}>
          <Button 
            title="Chat with Seller" 
            onPress={handleChat}
            color="green"
          />
        </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityInput: {
    width: 50,
    height: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default ItemDetailScreen;
