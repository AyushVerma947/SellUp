import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search for Products</Text>
      <TextInput style={styles.input} placeholder="Search..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    borderRadius: 5,
    marginTop: 10,
  },
});

export default SearchScreen;
