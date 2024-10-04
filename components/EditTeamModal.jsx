import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";

const EditTeamModal = ({ visible, team, onClose, onSubmit }) => {
  const [teamName, setTeamName] = useState(team.team_name);
  const [members, setMembers] = useState(team.members);

  const handleAddMember = () => {
    if (members.length >= 4) {
      Alert.alert("Error", "You can't add more than 4 members.");
      return;
    }
    setMembers([...members, ""]); // Add an empty string for a new member input
  };

  const handleUpdateMember = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = () => {
    if (teamName === "") {
      Alert.alert("Error", "Team name cannot be empty.");
      return;
    }
    onSubmit({ ...team, team_name: teamName, members });
    onClose(); // Close the modal after submitting
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Team</Text>

          <TextInput
            style={styles.input}
            placeholder="Team Name"
            value={teamName}
            onChangeText={(text) => setTeamName(text)}
          />

          {members.map((member, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder="Member Email"
              value={member}
              onChangeText={(value) => handleUpdateMember(index, value)}
            />
          ))}

          <Button title="Add Member" onPress={handleAddMember} />
          <Button title="Save Changes" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default EditTeamModal;
