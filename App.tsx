import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import SellScreen from './src/screens/SellScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CartProvider } from './src/screens/CartContext';
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import MyProductsScreen from './src/screens/MyProductsScreen';
import UserDetailScreen from './src/screens/UserDetailScreen';
import ScanScreen from './src/screens/ScanScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';


// import CartScreen from './src/screens/CartScreen';

// Creating the bottom tab navigator
const Tab = createBottomTabNavigator();
// Creating the stack navigator
const Stack = createStackNavigator();



function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#fff', paddingBottom: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" size={size} color={color} />
            
          ),
        }}
      />
      <Tab.Screen
        name="Sell"
        component={SellScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="sell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MyProductsScreen" component={MyProductsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ScanScreen" component={ScanScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChatListScreen" component={ChatListScreen} options={{ headerShown: false }} />

          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />




          
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
