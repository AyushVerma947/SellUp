import React, { useState , useEffect} from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, 
  Alert, PermissionsAndroid, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator 
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth"; 
// import firebase from "firebase/app";
// import { Alert } from "react-native";
import TouchID from "react-native-touch-id";
import { CLOUDINARY_URL } from '@env';


// const CLOUDINARY_URL = CLOUDINARY_URL;
const UPLOAD_PRESET = "itemsimage";

const SellScreen = () => {
  const [item, setItem] = useState({
    name: "",
    price: "",
    years_used: "",
    company: "",
    condition: "",
    color: "",
    quantity: 1, // Initialize quantity with a default value
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sellerName, setSellerName] = useState("");

  // Fetch the seller's name when the component mounts
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setSellerName(user.email); // Use the display name or email if displayName is not set
    }
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera access to take photos.",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async (fromCamera) => {
    if (fromCamera) {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "Camera permission is required.");
        return;
      }
    }

    const options = { mediaType: "photo", quality: 0.8 };
    const picker = fromCamera ? launchCamera : launchImageLibrary;

    picker(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert("Error", response.errorMessage);
        return;
      }
      if (response.assets) {
        setItem({ ...item, image: response.assets[0].uri });
        setErrors((prev) => ({ ...prev, image: null }));
      }
    });
  };

  const uploadImageToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append("file", { uri: imageUri, type: "image/jpeg", name: "upload.jpg" });
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!item.name) newErrors.name = "Item Name is required";
    if (!item.price) newErrors.price = "Price is required";
    if (!item.years_used) newErrors.years_used = "Years Used is required";
    if (!item.company) newErrors.company = "Company name is required";
    if (!item.condition) newErrors.condition = "Condition is required";
    if (!item.color) newErrors.color = "Color is required";
    if (!item.quantity || item.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (!item.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;


  // **Step 1: Prompt Biometric Authentication**
  const optionalConfig = {
    title: "Authentication Required",
    imageColor: "#4285F4",
    imageErrorColor: "#FF0000",
    sensorDescription: "Touch sensor",
    sensorErrorDescription: "Failed",
    cancelText: "Cancel",
  };

  try {
    const success = await TouchID.authenticate(
      "Scan your fingerprint to post the item",
      optionalConfig
    );

    if (!success) {
      Alert.alert("Authentication Failed", "Biometric authentication was not successful.");
      return;
    }
  } catch (error) {
    console.error("Biometric Authentication Error:", error);
    Alert.alert("Authentication Error", "Biometric authentication failed.");
    return;
  }


    setLoading(true);
    
    const imageUrl = await uploadImageToCloudinary(item.image);
    if (!imageUrl) {
      setLoading(false);
      Alert.alert("Error", "Failed to upload image. Try again.");
      return;
    }
  
    try {
      // Add item to "items" collection
      const itemRef = await firestore().collection("items").add({
        name: item.name,
        price: item.price,
        years_used: item.years_used,
        company: item.company,
        condition: item.condition,
        color: item.color,
        quantity: item.quantity,
        image: imageUrl,
        seller: sellerName, // Add the seller's name here
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  
      // Get the user ID using Firebase auth
      const userId = auth().currentUser?.uid;
  
      if (!userId) {
        setLoading(false);
        Alert.alert("Error", "User not authenticated.");
        return;
      }
  
      console.log("Item ID: ", itemRef.id);
      console.log("User ID: ", userId);
  
      // Add the item ID to the user's "products" array
      await firestore().collection("users").doc(userId).update({
        products: firestore.FieldValue.arrayUnion(itemRef.id), // Adds the item ID to the user's products array
      });
  
      setLoading(false);
      Alert.alert("Success", "Item posted successfully!");
      setItem({ name: "", price: "", years_used: "", company: "", condition: "", color: "", quantity: 1, image: null });
      setErrors({});
    } catch (error) {
      console.error("Error adding item:", error); // Log error for debugging
      setLoading(false);
      Alert.alert("Error", "Failed to save item details.");
    }
  };
  
  

  const incrementQuantity = () => {
    setItem({ ...item, quantity: item.quantity + 1 });
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      setItem({ ...item, quantity: item.quantity - 1 });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.header}>Post an Item for Sale</Text>

          <TextInput 
            style={styles.input} 
            placeholder="Item Name" 
            value={item.name} 
            onChangeText={(text) => setItem({ ...item, name: text })} 
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <TextInput 
            style={styles.input} 
            placeholder="Price ($)" 
            keyboardType="numeric" 
            value={item.price} 
            onChangeText={(text) => setItem({ ...item, price: text })} 
          />
          {errors.price && <Text style={styles.error}>{errors.price}</Text>}

          <TextInput 
            style={styles.input} 
            placeholder="Years Used" 
            keyboardType="numeric" 
            value={item.years_used} 
            onChangeText={(text) => setItem({ ...item, years_used: text })} 
          />
          {errors.years_used && <Text style={styles.error}>{errors.years_used}</Text>}

          <TextInput 
            style={styles.input} 
            placeholder="Company" 
            value={item.company} 
            onChangeText={(text) => setItem({ ...item, company: text })} 
          />
          {errors.company && <Text style={styles.error}>{errors.company}</Text>}

          <TextInput 
            style={styles.input} 
            placeholder="Condition" 
            value={item.condition} 
            onChangeText={(text) => setItem({ ...item, condition: text })} 
          />
          {errors.condition && <Text style={styles.error}>{errors.condition}</Text>}

          <TextInput 
            style={styles.input} 
            placeholder="Color" 
            value={item.color} 
            onChangeText={(text) => setItem({ ...item, color: text })} 
          />
          {errors.color && <Text style={styles.error}>{errors.color}</Text>}

          {/* Quantity Input with Buttons */}
          <View style={styles.quantityContainer}>
            <Text>Quantity: {item.quantity}</Text>
            <View style={styles.quantityButtons}>
              <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={String(item.quantity)}
                onChangeText={(text) => setItem({ ...item, quantity: Math.max(1, parseInt(text) || 1) })}
                keyboardType="numeric"
              />
              <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}

          {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
          
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.button} onPress={() => handleImagePick(false)}>
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleImagePick(true)}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {errors.image && <Text style={styles.error}>{errors.image}</Text>}

          {loading ? <ActivityIndicator size="large" color="#007bff" /> : (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Post Item</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
  image: { width: "100%", height: 200, borderRadius: 5, marginBottom: 15 },
  imageButtons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  button: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, alignItems: "center", flex: 1, marginRight: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  submitButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 5, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  error: { color: "red", fontSize: 12, marginBottom: 10 },
  quantityContainer: { marginBottom: 15 },
  quantityButtons: { flexDirection: "row", alignItems: "center" },
  quantityButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 5, marginRight: 10 },
  quantityButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  quantityInput: { width: 50, height: 40, borderColor: "#ccc", borderWidth: 1, textAlign: "center", fontSize: 18 },
});

export default SellScreen;
