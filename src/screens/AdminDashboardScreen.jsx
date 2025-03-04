import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";

const AdminDashboardScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = await firestore().collection("users").where("role", "==", "user").get();
      const usersData = usersCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch users.");
    }
  };

  // Triggered when pulling to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate("UserDetailScreen", { userId: item.id })} // Navigate to UserDetailScreen
    >
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.createdAt?.toDate().toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : users.length === 0 ? (
        <Text>No users found.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Email</Text>
              <Text style={styles.headerText}>Joined</Text>
            </View>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
});

export default AdminDashboardScreen;
