import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const [role, setRole] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert("Error", "No user found");
        return;
      }

      try {
        const userDoc = await firestore().collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          setRole(userDoc.data().role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Settings</Text>
  
        {/* Check if role is admin */}
        {role === "admin" && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("AdminDashboardScreen")}
            >
              <Text style={styles.buttonText}>Go to Admin Dashboard</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("MyProductsScreen")}
            >
              <Text style={styles.buttonText}>My Products</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ChatListScreen")}
            >
              <Text style={styles.buttonText}>Chats</Text>
            </TouchableOpacity> */}
          </>
        )}
  
        {/* Check if role is user */}
        {role === "user" && (
          <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MyProductsScreen")}
          >
            <Text style={styles.buttonText}>My Products</Text>
          </TouchableOpacity>
          
          {/* <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ChatListScreen")}
            >
              <Text style={styles.buttonText}>Chats</Text>
            </TouchableOpacity> */}

            </>
          
        )}
      </View>
    );
  };
    

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#4285F4", padding: 15, borderRadius: 5, marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default SettingsScreen;
