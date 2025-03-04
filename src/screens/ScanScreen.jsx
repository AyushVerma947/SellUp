import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'react-native-vision-camera'; // Import vision camera
import { useNavigation } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner'; // QR scanner component
import { RNCamera } from 'react-native-camera'; // For flash mode and camera functionalities

const ScanScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null); // Set initial state to null

  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const permissionStatus = await Camera.requestCameraPermission();
      setHasPermission(permissionStatus === 'granted');
      console.log(permissionStatus)

    };
    console.log("ger");
    console.log(hasPermission)
    requestPermissions();
  }, []); // Run this effect once when the component mounts

  const onScan = (e) => {
    // Handle the QR code scan result here
    console.log('Scanned QR code:', e.data);
    navigation.goBack();  // Navigate back after scan
  };

  // If the permission status is still null, show a loading state
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  // If permission is denied, show the message asking for permission
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // If permission is granted, show the QR code scanner
  return (
    // <QRCodeScanner
    //   onRead={onScan}  // Handle the QR code scan result
    //   flashMode={RNCamera.Constants.FlashMode.auto} // Set the default flash mode
    //   topContent={<Text style={styles.topText}>Scan a QR Code to proceed</Text>}
    //   bottomContent={
    //     <View style={styles.bottomContent}>
    //       <Text style={styles.bottomText}>Scan a QR code to proceed.</Text>
    //       <Button
    //         title="Cancel"
    //         onPress={() => navigation.goBack()}  // Allow the user to cancel the scanning
    //       />
    //     </View>
    //   }
    // />
    <View>
        <Text>Under construction</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  topText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  bottomText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});

export default ScanScreen;
