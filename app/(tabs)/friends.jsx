import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Redirect, router } from "expo-router";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation
import { fetchUsers } from "../../lib/appwrite"; // Import the function from appwrite.js
import { Avatar } from "../../components/Avatar"; // Custom avatar component
import { MessageIcon } from "../../components/MessageIcon"; // Custom message icon component
import { styled } from "nativewind";
import SecondaryButton from "../../components/SecondaryButton"; // Import SecondaryButton

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const FindFriend = () => {
  const navigation = useNavigation(); // Get navigation object
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch all users when the page loads
  useEffect(() => {
    const fetchUserData = async () => {
      const usersData = await fetchUsers();
      setAllUsers(usersData);
      setFilteredUsers(usersData); // Show all users initially
    };
    fetchUserData();
  }, []);

  const handleSearch = () => {
    if (searchTerm === "") {
      // Show all users if search term is empty
      setFilteredUsers(allUsers);
    } else {
      // Filter users based on search term (case-insensitive)
      const filtered = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAvatarClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <StyledView className="flex-row items-center mb-4">
      {/* Avatar */}
      <TouchableOpacity onPress={() => handleAvatarClick(item)}>
        <Avatar url={item.avatar} />
      </TouchableOpacity>

      {/* User Details */}
      <StyledView className="ml-4">
        {/* Full Name */}
        <StyledText className="text-lg font-bold">{item.full_name}</StyledText>

        {/* Username (smaller text) */}
        <StyledText className="text-sm text-gray-500">
          @{item.username}
        </StyledText>
      </StyledView>

      {/* Message Icon */}
      <TouchableOpacity className="ml-auto">
        <MessageIcon userId={item.accountId} />
      </TouchableOpacity>
    </StyledView>
  );

  return (
    <StyledView className="p-4">
      <StyledView className="flex-row items-center mb-4">
        <StyledTextInput
          className="border rounded p-2 flex-grow"
          placeholder="Search for a friend..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          className="bg-blue-500 p-2 ml-2 rounded"
          onPress={handleSearch}
        >
          <StyledText className="text-white">Search</StyledText>
        </TouchableOpacity>
      </StyledView>

      {/* Register Your Team Button */}
      <StyledView className="flex items-center">
        <SecondaryButton title="Register Your Team" containerStyles="my-2" />
      </StyledView>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
      />

      {/* User Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StyledView className="flex-1 justify-center items-center bg-gray-800 bg-opacity-75">
          {/* Updated modal design */}
          <StyledView className="bg-white p-6 rounded-lg w-4/5">
            {" "}
            {/* Increased width */}
            {/* Close icon at the top right */}
            <TouchableOpacity
              className="absolute top-3 right-3"
              onPress={() => setModalVisible(false)}
            >
              <StyledText className="text-xl text-gray-600">✖</StyledText>{" "}
              {/* Make sure this is wrapped in StyledText */}
            </TouchableOpacity>
            {/* Avatar at the top */}
            <StyledView className="flex items-center mb-4">
              <Avatar url={selectedUser?.avatar} />
            </StyledView>
            {/* User information */}
            {selectedUser && (
              <>
                <StyledText className="text-xl font-bold text-center mb-2">
                  {selectedUser.full_name}
                </StyledText>
                <StyledText className="text-center text-gray-600 mb-4">
                  @{selectedUser.username}
                </StyledText>
                <StyledText className="mt-2">
                  MBTI: {selectedUser.mbti}
                </StyledText>
                <StyledText className="mt-2">
                  Country: {selectedUser.country}
                </StyledText>
                <StyledText className="mt-2">
                  Introduction: {selectedUser.introduction}
                </StyledText>

                {/* Safely handle travel_preferences */}
                <StyledText className="mt-2">
                  Travel Preferences:{" "}
                  {Array.isArray(selectedUser.travel_preferences)
                    ? selectedUser.travel_preferences.join(", ")
                    : "No preferences listed"}
                </StyledText>
              </>
            )}
          </StyledView>
        </StyledView>
      </Modal>
    </StyledView>
  );
};

export default FindFriend;
