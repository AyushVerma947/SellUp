import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TextInput, 
  Dimensions, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for the icon

const screenWidth = Dimensions.get('window').width;
const numColumns = 2;
const padding = 10;
const itemWidth = (screenWidth - (padding * 3)) / numColumns;

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);  // New loading state
  const [refreshing, setRefreshing] = useState(false);  // Track pull-to-refresh state

  // Fetch items from Firestore
  const fetchItems = async () => {
    setLoading(true);
    try {
      const snapshot = await firestore().collection('items').get();
      const itemList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemList);
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    } finally {
      setLoading(false);  // Set loading to false after fetching is complete
      setRefreshing(false);  // Stop refreshing spinner after data load
    }
  };

  useEffect(() => {
    fetchItems();  // Fetch items on initial load
  }, []);

  // Filter items based on the search text
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to handle pull-to-refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    fetchItems();  // Re-fetch items when user pulls to refresh
  };

  return (
    <View style={styles.container}>
      {/* Search Bar and QR Scanner Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search items"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity 
          style={styles.scannerButton}
          onPress={() => navigation.navigate('ScanScreen')}  // Navigate to the QR scanner screen
        >
          <Icon name="qrcode" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Show loading spinner while data is being loaded */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
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
              <Text style={styles.itemPrice}>${item.price}</Text>
            </TouchableOpacity>
          )}
          refreshing={refreshing}  // Show refresh indicator when pulling down
          onRefresh={handleRefresh}  // Trigger refresh on pull-to-refresh
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: padding,
  },
  searchContainer: {
    flexDirection: 'row',  // Align search bar and scanner button horizontally
    alignItems: 'center',
    marginBottom: padding,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    flex: 1,  // Take up remaining space
  },
  scannerButton: {
    marginLeft: padding,
    padding: 10,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
