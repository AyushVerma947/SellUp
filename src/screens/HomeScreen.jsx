import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TextInput, 
  Dimensions, 
  TouchableOpacity 
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const padding = 10;
const itemWidth = (screenWidth - (padding * 3)) / numColumns;

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  
  const items = [
    { id: "1", name: "Laptop", price: 500.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "Dell", condition: "Good", color: "Silver" },
    { id: "2", name: "Phone", price: 300.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Samsung", condition: "Like New", color: "Black" },
    { id: "3", name: "Headphones", price: 80.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Sony", condition: "Excellent", color: "White" },
    { id: "4", name: "Smartwatch", price: 150.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 3, company: "Apple", condition: "Good", color: "Black" },
    { id: "5", name: "Tablet", price: 250.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "Samsung", condition: "Fair", color: "Gray" },
    { id: "6", name: "Keyboard", price: 40.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Logitech", condition: "Like New", color: "Black" },
    { id: "7", name: "Mouse", price: 25.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "HP", condition: "Good", color: "Black" },
    { id: "8", name: "Monitor", price: 200.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 3, company: "LG", condition: "Fair", color: "Black" },
    { id: "9", name: "Speaker", price: 60.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Bose", condition: "Excellent", color: "Black" },
    { id: "10", name: "Camera", price: 450.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "Canon", condition: "Good", color: "Black" },
    { id: "11", name: "Router", price: 80.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "TP-Link", condition: "Excellent", color: "White" },
    { id: "12", name: "External Hard Drive", price: 100.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Seagate", condition: "Like New", color: "Black" },
    { id: "13", name: "Charger", price: 20.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Anker", condition: "Excellent", color: "White" },
    { id: "14", name: "Flash Drive", price: 15.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "SanDisk", condition: "Good", color: "Red" },
    { id: "15", name: "Projector", price: 350.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "Epson", condition: "Excellent", color: "White" },
    { id: "16", name: "Bluetooth Speaker", price: 90.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "JBL", condition: "Good", color: "Blue" },
    { id: "17", name: "Electric Kettle", price: 30.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Philips", condition: "Excellent", color: "White" },
    { id: "18", name: "Air Fryer", price: 120.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Ninja", condition: "Like New", color: "Black" },
    { id: "19", name: "Microwave", price: 200.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 3, company: "Panasonic", condition: "Good", color: "Silver" },
    { id: "20", name: "Refrigerator", price: 600.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "LG", condition: "Excellent", color: "White" },
    { id: "21", name: "Washing Machine", price: 400.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 3, company: "Samsung", condition: "Good", color: "White" },
    { id: "22", name: "Iron", price: 50.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Philips", condition: "Excellent", color: "Black" },
    { id: "23", name: "Fan", price: 30.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Lasko", condition: "Good", color: "White" },
    { id: "24", name: "Air Conditioner", price: 450.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "Daikin", condition: "Excellent", color: "White" },
    { id: "25", name: "Coffee Maker", price: 90.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Nespresso", condition: "Like New", color: "Black" },
    { id: "26", name: "Blender", price: 100.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Oster", condition: "Good", color: "Black" },
    { id: "27", name: "Toaster", price: 40.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 2, company: "Cuisinart", condition: "Good", color: "Silver" },
    { id: "28", name: "Vacuum Cleaner", price: 150.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Dyson", condition: "Excellent", color: "Yellow" },
    { id: "29", name: "Electric Toothbrush", price: 40.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Philips Sonicare", condition: "Good", color: "White" },
    { id: "30", name: "Hair Dryer", price: 60.00, image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", years_used: 1, company: "Remington", condition: "Like New", color: "Black" }
];


  // Filter items based on the search text
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search items"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Grid of items */}
      <FlatList
        data={filteredItems}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.itemContainer, { width: itemWidth }]} 
            onPress={() => navigation.navigate('ItemDetail', { item: item })}  // Navigate to ItemDetail screen
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: padding,
  },
  itemContainer: {
    margin: padding / 2,
    alignItems: "center",
  },
  itemImage: {
    width: itemWidth - 20,
    height: itemWidth - 20,
    borderRadius: 10,
  },
  itemName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "gray",
  },
});

export default HomeScreen;
