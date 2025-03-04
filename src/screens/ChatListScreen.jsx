import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const user = auth().currentUser;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .where("users", "array-contains", user.uid)
      .onSnapshot((snapshot) => {
        const chatList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatList);
      });

    return () => unsubscribe();
  }, []);

  return (
    <View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ChatScreen", { receiverId: item.otherUserId })}>
            <Text>{item.otherUserName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatListScreen;
