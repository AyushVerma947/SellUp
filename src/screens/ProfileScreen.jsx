import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import QRCode from 'react-native-qrcode-svg';
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const [fuser,setfuser] = useState(null);
  const qrCodeSize = 200;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await GoogleSignin.signInSilently(); // Get the signed-in user info without prompting for sign-in
        console.log("User Info:", user);

        const { user: userDetails } = user.data; // Extract user info
        setUserInfo(userDetails);

        const fuser1 = auth().currentUser;
        // console.log(fuser.uid)
        setfuser(fuser1);
      } catch (error) {
        console.error("Error fetching user info:", error);

        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          Alert.alert("Sign-In Required", "Please sign in first.");
          navigation.replace("Login");  // Redirect to Login screen if not signed in
        } else {
          Alert.alert("Error", "An error occurred while fetching user info.");
        }
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(info => {
        console.log(info);
        setLocation({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      });
    };

    fetchUserInfo();
    getCurrentLocation();
  }, []);

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut(); // Sign out the user
      Alert.alert("Signed out", "You have been signed out successfully.");
      navigation.replace("Login");  // Navigate back to Login screen after sign out
    } catch (error) {
      console.error("Sign-Out Error:", error);
      Alert.alert("Error", "There was an issue signing you out.");
    }
  };

  if (!userInfo || !location) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading user info...</Text>
      </View>
    );
  }

  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=14/${location.latitude}/${location.longitude}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: userInfo.photo }} style={styles.profileImage} />
      <Text style={styles.text}>Name: {userInfo.name}</Text>
      <Text style={styles.text}>Email: {userInfo.email}</Text>
      {/* <Text style={styles.text}>Email: {userInfo.Id}</Text> */}

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      <View>
        <QRCode
          value={fuser.email}
          size={qrCodeSize}
          style={styles.qr}
          // You can customize the appearance of the QR code using props like color, backgroundColor, etc.
          // Example:
          // color="black"
          // backgroundColor="white"
        />
      </View>

      {/* WebView to show OpenStreetMap */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ uri: openStreetMapUrl }} // Load OpenStreetMap URL with user's current location
          style={styles.webview}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures content stretches to fill the screen
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4285F4",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mapContainer: {
    width: '100%',
    height: 300, // You can adjust the height to fit your UI
    marginTop: 20,
  },
  webview: {
    flex: 1,
  },
  qr: {
    padding: 20,
  },
});

export default ProfileScreen;
