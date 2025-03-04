import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const ChatScreen = ({ route }) => {
  const { receiverId } = route.params; // Get recipient user ID from navigation params
  const user = auth().currentUser;
  const chatId = [user.uid, receiverId].sort().join("_"); // Unique chat ID for two users

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const allMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().timestamp.toDate(),
          user: {
            _id: doc.data().senderId,
            name: doc.data().senderName || "User",
          },
        }));
        setMessages(allMessages);
      });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (newMessages = []) => {
    const { text, _id, createdAt, user } = newMessages[0];

    await firestore().collection("chats").doc(chatId).collection("messages").add({
      _id,
      text,
      senderId: user._id,
      senderName: user.name,
      receiverId,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  }, []);

  return <GiftedChat messages={messages} onSend={onSend} user={{ _id: user.uid, name: user.displayName }} />;
};

export default ChatScreen;
