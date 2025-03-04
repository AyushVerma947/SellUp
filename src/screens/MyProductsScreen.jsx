import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Alert, ScrollView } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const MyProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProducts = async () => {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert("Error", "No user found");
        return;
      }

      try {
        const userDoc = await firestore().collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const userProducts = userDoc.data().products || [];
          console.log("User's products IDs:", userProducts); // Log product IDs

          if (userProducts.length > 0) {
            // Fetch the details of each product using their IDs
            const productDocs = await Promise.all(
              userProducts.map(async (productId) => {
                const productDoc = await firestore().collection("items").doc(productId).get();
                return productDoc.exists ? { id: productId, ...productDoc.data() } : null;
              })
            );
        
            // Set the products after filtering out null values
            setProducts(productDocs.filter((product) => product !== null));
          } else {
            Alert.alert("No Products", "You have not added any products.");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user products:", error);
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <Text>No Image Available</Text> // Handle missing images gracefully
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.productDetails}>{item.condition}</Text>
          <Text style={styles.productDetails}>Quantity: {item.quantity}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Products</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  productItem: {
    flexDirection: "row", // Align image and text horizontally
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center", // Center align content vertically
  },
  imageContainer: {
    width: 80, // Set width for image container
    height: 80, // Set height for image container
    marginRight: 15, // Space between image and text
    borderRadius: 10,
    overflow: "hidden", // Ensures image stays within container
    borderWidth: 1, // Optional: add border to image
    borderColor: "#ddd", // Optional: image border color
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1, // Take remaining space
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#00BFFF", // Blue color for price
    fontWeight: "600",
    marginBottom: 5,
  },
  detailsContainer: {
    marginTop: 5,
  },
  productDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3, // Space between details
  },
});

export default MyProductsScreen;
