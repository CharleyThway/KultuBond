import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchUsers } from "../../lib/findFriends";
import { styled } from "nativewind";
import SecondaryButton from "../../components/SecondaryButton";
import { useGlobalContext } from "../../context/GlobalProvider"; // Import Global Context
import icons from "../../constants/icons";

const { width } = Dimensions.get("window"); // Get device width for responsive card sizing
const CARD_MARGIN = 10; // Margin between cards
const CARD_WIDTH = (width - 3 * CARD_MARGIN) / 2.5; // Calculate card width for 2 columns with margins

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);


const FindFriend = () => {
  const navigation = useNavigation();
  const { user } = useGlobalContext(); // Get the logged-in user from the context
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const usersData = await fetchUsers();
      // Filter out the current logged-in user
      const filteredData = usersData.filter((u) => u.accountId !== user.$id);
      setAllUsers(filteredData);
      setFilteredUsers(filteredData);
    };
    fetchUserData();
  }, [user]); // Re-run if user changes

  const handleSearch = () => {
    if (searchTerm === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

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

  const handleAvatarClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleAvatarClick(item)} style={{ margin: CARD_MARGIN }}>
      <StyledView
        style={{ width: CARD_WIDTH }}
        className="bg-white p-4 rounded-lg shadow-md items-center"
      >
        <Image
          source={{ uri: item.avatar }}
          className="w-20 h-20 rounded-full mb-2"
        />
        <StyledText className="text-lg font-bold">{item.full_name}</StyledText>
        <StyledText className="text-sm text-gray-500 mb-5">
          @{item.username}
        </StyledText>
        {/*<icons.chat width={30} height={30} resizeMode="contain" onPress={handleMessageClick}/> */}
      </StyledView>
      </TouchableOpacity>
    
  );

  return (
    <StyledView className="p-4">
      {/* Search bar */}
      <StyledView className="flex-row items-center mb-4">
        <StyledTextInput
          className="border rounded p-2 flex-grow"
          placeholder="Search for a friend..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          className="bg-gray-400 p-2 ml-2 rounded"
          onPress={handleSearch}
        >
          <StyledText className="text-white">Search</StyledText>
        </TouchableOpacity>
      </StyledView>

      {/* Register Team Button */}
      <StyledView className="flex items-center mb-4">
        <SecondaryButton title="Register Your Team" containerStyles="my-2" />
      </StyledView>
      <StyledView className="items-center">
      {/* Grid layout for displaying friends */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        numColumns={2} // Make it a grid with 2 columns
        showsVerticalScrollIndicator={false}
      />
      </StyledView>

      {/* Modal for detailed user info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <StyledView className="flex-1 justify-center items-center bg-gray-800 bg-opacity-75">
          <StyledView className="bg-white p-6 rounded-lg w-4/5">
            <TouchableOpacity
              className="absolute top-3 right-3"
              onPress={() => setModalVisible(false)}
            >
              <StyledText className="text-xl text-gray-600">✖</StyledText>
            </TouchableOpacity>

            <StyledView className="flex items-center mb-4">
              <Image
                source={{ uri: selectedUser?.avatar }}
                className="w-20 h-20 rounded-full"
              />
            </StyledView>

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
                <StyledText className="mt-2">
                  Travel Preferences: {selectedUser.travel_preferences}
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