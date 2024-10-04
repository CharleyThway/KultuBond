import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Use navigation hook
import { styled } from "nativewind";
import { createChatRoom } from "../lib/appwrite"; // Import the createChatRoom function
import { useGlobalContext } from "../context/GlobalProvider";
import { databases, ID } from "../lib/appwrite";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

export const MessageIcon = ({ userId }) => {
  const navigation = useNavigation(); // Navigation object
  const { user } = useGlobalContext(); // Get the current logged-in user

  const handleMessageClick = async () => {
    try {
      // Create or get the existing chat room
      const chatRoomId = await createChatRoom(user.$id, userId);

      // Navigate to chatroom
      navigation.navigate("ChatRoom", { chatRoomId });
    } catch (error) {
      console.error("Error redirecting to chatroom:", error);
    }
  };

  return (
    <StyledTouchableOpacity onPress={handleMessageClick}>
      <StyledText className="text-blue-500">💬</StyledText>
    </StyledTouchableOpacity>
  );
};
