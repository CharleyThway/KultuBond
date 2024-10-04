import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { fetchChatRooms } from "../../lib/appwrite"; // Create a function to fetch chat rooms
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

const ChatHistory = ({ navigation }) => {
  const { user } = useGlobalContext();
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const loadChatRooms = async () => {
      const rooms = await fetchChatRooms(user.$id);
      setChatRooms(rooms);
    };

    loadChatRooms();
  }, [user.$id]);

  const handleRoomClick = (chatRoomId) => {
    navigation.navigate("ChatRoom", { chatRoomId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRoomClick(item.chatRoomId)}>
      <StyledView className="p-4 bg-gray-200 mb-2 rounded">
        <StyledText>
          Chat with {item.user1Id === user.$id ? item.user2Id : item.user1Id}
        </StyledText>
      </StyledView>
    </TouchableOpacity>
  );

  return (
    <StyledView className="flex-1 p-4">
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
      />
    </StyledView>
  );
};

export default ChatHistory;
