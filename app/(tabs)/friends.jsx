import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchUsers } from "../../lib/findFriends";
import { Avatar } from "../../components/Avatar";
import { MessageIcon } from "../../components/MessageIcon";
import { styled } from "nativewind";
import SecondaryButton from "../../components/SecondaryButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getTeamDetails } from "../../lib/teamService"; // Import team service

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
  const [hasTeam, setHasTeam] = useState(false); // State to track if the user has a team

  useEffect(() => {
    const fetchUserData = async () => {
      const usersData = await fetchUsers();

      // Filter out the current logged-in user
      const filteredData = usersData.filter((u) => u.accountId !== user.$id);

      setAllUsers(filteredData);
      setFilteredUsers(filteredData);
    };

    const checkTeamStatus = async () => {
      try {
        const team = await getTeamDetails(user.$id);
        if (team) {
          setHasTeam(true); // User has a team
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };

    fetchUserData();
    checkTeamStatus(); // Check if the user has a team
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

  const handleAvatarClick = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <StyledView className="flex-row items-center mb-4">
      <TouchableOpacity onPress={() => handleAvatarClick(item)}>
        <Avatar url={item.avatar} />
      </TouchableOpacity>

      <StyledView className="ml-4">
        <StyledText className="text-lg font-bold">{item.full_name}</StyledText>
        <StyledText className="text-sm text-gray-500">
          @{item.username}
        </StyledText>
      </StyledView>

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

      <StyledView className="flex items-center">
        {hasTeam ? (
          <SecondaryButton
            title="My Team"
            containerStyles="my-2"
            handlePress={() => navigation.navigate("my-team")} // Navigate to My Team page
          />
        ) : (
          <SecondaryButton
            title="Register Your Team"
            containerStyles="my-2"
            handlePress={() => navigation.navigate("team-register")} // Navigate to team registration
          />
        )}
      </StyledView>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
      />

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
              <Avatar url={selectedUser?.avatar} />
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
