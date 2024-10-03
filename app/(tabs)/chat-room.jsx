import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getChatMessages, sendMessage } from "../../lib/appwrite";

const ChatRoom = ({ roomId, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await getChatMessages(roomId);
        setMessages(chatMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [roomId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await sendMessage(roomId, user.accountId, newMessage);
      setMessages((prev) => [
        ...prev,
        { message: newMessage, sender_id: user.accountId },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <ScrollView className="flex-1">
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`mb-2 p-2 ${
              msg.sender_id === user.accountId ? "bg-blue-100" : "bg-white"
            } rounded`}
          >
            <Text>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row mt-2">
        <TextInput
          className="flex-1 p-2 bg-white rounded"
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity
          className="ml-2 p-2 bg-blue-500 rounded"
          onPress={handleSendMessage}
        >
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatRoom;
