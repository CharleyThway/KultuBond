import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { getOrCreateChatRoom } from "../../lib/appwrite";
import { useRouter } from "expo-router";

const ChatHistory = ({ user }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch chat rooms for the current user
    const fetchChatRooms = async () => {
      try {
        const rooms = await getOrCreateChatRoom(user.accountId, null); // Fetch all rooms
        setChatRooms(rooms);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, [user]);

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-lg font-semibold">Your Chats</Text>
      {chatRooms.map((room) => (
        <TouchableOpacity
          key={room.$id}
          onPress={() => router.push(`/tabs/chat-room/${room.$id}`)}
        >
          <View className="p-4 mb-2 bg-white rounded shadow">
            <Text className="font-bold">Chat Room: {room.user2_id}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default ChatHistory;
