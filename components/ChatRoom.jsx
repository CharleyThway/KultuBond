import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { fetchMessages, sendMessage } from "../lib/appwrite"; // Import message functions
import { useGlobalContext } from "../context/GlobalProvider";
import { styled } from "nativewind";
import { databases, ID } from "../lib/appwrite";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const ChatRoom = ({ route }) => {
  const { chatRoomId } = route.params;
  const { user } = useGlobalContext();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  // Fetch messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      const chatMessages = await fetchMessages(chatRoomId);
      setMessages(chatMessages);
    };

    loadMessages();
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    if (messageText.trim() === "") return;

    await sendMessage(chatRoomId, user.$id, messageText);
    setMessageText("");
    const chatMessages = await fetchMessages(chatRoomId);
    setMessages(chatMessages); // Refresh chat
  };

  const renderMessage = ({ item }) => (
    <StyledView
      className={`p-2 rounded ${
        item.senderId === user.$id ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <StyledText
        className={item.senderId === user.$id ? "text-white" : "text-black"}
      >
        {item.message}
      </StyledText>
    </StyledView>
  );

  return (
    <StyledView className="flex-1 p-4">
      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={renderMessage}
      />

      {/* Input Field */}
      <StyledView className="flex-row items-center mt-4">
        <StyledTextInput
          className="flex-grow border rounded p-2"
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <TouchableOpacity
          className="bg-blue-500 p-2 ml-2 rounded"
          onPress={handleSendMessage}
        >
          <StyledText className="text-white">Send</StyledText>
        </TouchableOpacity>
      </StyledView>
    </StyledView>
  );
};

export default ChatRoom;
