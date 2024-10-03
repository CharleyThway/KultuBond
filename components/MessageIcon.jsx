import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

export const MessageIcon = ({ userId }) => {
  const handleMessageClick = () => {
    // Handle message sending logic here
    console.log("Send message to user with ID:", userId);
  };

  return (
    <StyledTouchableOpacity onPress={handleMessageClick}>
      <StyledText className="text-blue-500">💬</StyledText>
    </StyledTouchableOpacity>
  );
};
