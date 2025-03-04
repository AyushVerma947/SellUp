import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ScrollView, Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";

const UserDetailScreen = ({ route }) => {
  const { userId } = route.params; // Get userId from navigation params
  const [userDetails, setUserDetails] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = await firestore().collection("users").doc(userId).get();
        if (userDoc.exists) {
          setUserDetails(userDoc.data());
        } else {
          Alert.alert("Error", "User not found.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        Alert.alert("Error", "Failed to fetch user details.");
      }
    };

    const fetchUserProducts = async () => {
      setLoading(true); // Set loading to true at the start of the fetch operation
      console.log("Fetching user products...");

      try {
        const userDocRef = firestore().collection("users").doc(userId);
        const userDoc = await userDocRef.get();
        console.log("User document fetched:", userDoc.exists);

        if (userDoc.exists) {
          const userProducts = userDoc.data().products || []; // Get the products array from the user document
          console.log("User's products:", userProducts); // Log the products array

          if (userProducts.length > 0) {
            const productsData = await Promise.all(
              userProducts.map(async (productId) => {
                const productDoc = await firestore().collection("items").doc(productId).get();
                return productDoc.exists ? { id: productId, ...productDoc.data() } : null;
              })
            );

            setUserProducts(productsData.filter((product) => product !== null)); // Set the products after filtering out null values
          } else {
            console.log("No products found for this user.");
            setUserProducts([]); // No products found
          }
        } else {
          console.log("User document not found.");
          Alert.alert("Error", "User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user products:", error);
        Alert.alert("Error", "Failed to fetch user products.");
      } finally {
        console.log("Finished fetching user products.");
        setLoading(false); // Set loading to false when done
      }
    };

    fetchUserDetails();
    fetchUserProducts();
  }, [userId]);

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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!userDetails) {
    return <Text>User not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Details</Text>
      <Text style={styles.label}>Name: {userDetails.name}</Text>
      <Text style={styles.label}>Email: {userDetails.email}</Text>
      <Text style={styles.label}>Role: {userDetails.role}</Text>
      <Text style={styles.label}>
        Joined: {userDetails.createdAt?.toDate().toLocaleDateString() || "N/A"}
      </Text>

      <Text style={styles.productSectionTitle}>Posted Products</Text>
      {userProducts.length === 0 ? (
        <Text>No products found.</Text>
      ) : (
        <FlatList
          data={userProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 18, marginVertical: 10 },
  productSectionTitle: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },
  productItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  productName: { fontSize: 18, fontWeight: "bold" },
  productPrice: { fontSize: 16, color: "#555" },
  detailsContainer: { marginTop: 5 },
  productDetails: { fontSize: 14, color: "#777" },
});

export default UserDetailScreen;
