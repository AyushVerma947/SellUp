import React, { useEffect, useCallback  } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"; // Import Firestore
import { webClientId } from '@env';

const LoginScreen = ({ navigation }) => {



  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId, 
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    auth().currentUser; // Pre-loads Firebase auth system
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      console.log("🔍 Checking Google Play Services...");
      await GoogleSignin.hasPlayServices();
      console.log("✅ Google Play Services available.");

      console.log("🔍 Starting Google Sign-In...");
      const response = await GoogleSignin.signIn();
      console.log("✅ Google Sign-In successful:", response);

      const { idToken } = response.data; // Extract idToken correctly
      if (!idToken) throw new Error("Google Sign-In failed: No ID token found.");
      console.log("🔍 ID Token:", idToken);

      // Create Google credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log("🔍 Created Google credential:", googleCredential);

      // Sign in with Firebase
      const userCredential = await auth().signInWithCredential(googleCredential);
      console.log("✅ Firebase Sign-In successful:", userCredential);

      // Get Firebase user info
      const user = userCredential.user;
      console.log("✅ Firebase User Info:", user);

      // Check if user exists in Firestore
      const userRef = firestore().collection("users").doc(user.uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        // User does not exist, add to Firestore with default role "user"
        await userRef.set({
          name: user.displayName,
          email: user.email,
          role: "user", // Default role
          createdAt: firestore.FieldValue.serverTimestamp(),
          products: [], 
        });
        console.log("✅ User added to Firestore with role 'user'.");
      } else {
        console.log("✅ User already exists in Firestore.");
      }

      Alert.alert("Login Successful", `Welcome ${user.displayName}`);
      navigation.replace("Home");
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Sign-In Cancelled", "You cancelled the sign-in.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign-In in progress...");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Google Play Services are not available.");
      } else {
        Alert.alert("Error", error.message || "An unknown error occurred.");
      }
    }
  }
  , [navigation]
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sign-In</Text>
      <TouchableOpacity style={styles.button} onPress={signInWithGoogle} testID="login-button" >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#4285F4", padding: 15, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

// export default LoginScreen;
export default React.memo(LoginScreen);
