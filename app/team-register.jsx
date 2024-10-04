import React, { useState } from "react";
import { View, TextInput, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { Picker } from "@react-native-picker/picker";
import { createTeam } from "../lib/teamService";
import { useGlobalContext } from "../context/GlobalProvider";

const TeamRegister = () => {
  const { user } = useGlobalContext();
  const [teamName, setTeamName] = useState("");
  const [numMembers, setNumMembers] = useState(1); // Default to 1 member
  const [memberEmails, setMemberEmails] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Use navigation

  const handleMemberCountChange = (value) => {
    setNumMembers(value);
    const newEmails = [...memberEmails];
    if (value > memberEmails.length) {
      for (let i = memberEmails.length; i < value; i++) {
        newEmails.push("");
      }
    } else {
      newEmails.length = value;
    }
    setMemberEmails(newEmails);
  };

  const handleEmailChange = (index, email) => {
    const updatedEmails = [...memberEmails];
    updatedEmails[index] = email;
    setMemberEmails(updatedEmails);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await createTeam(teamName, user.$id, memberEmails);
      alert("Team registered successfully!");
      navigation.navigate("my-team"); // Navigate to My Team page after registration
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Register Your Team
      </Text>

      <TextInput
        placeholder="Team Name"
        value={teamName}
        onChangeText={setTeamName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Number of Members</Text>
      <Picker
        selectedValue={numMembers}
        style={{ height: 50, width: 150, marginBottom: 10 }}
        onValueChange={(value) => handleMemberCountChange(value)}
      >
        <Picker.Item label="1" value={1} />
        <Picker.Item label="2" value={2} />
        <Picker.Item label="3" value={3} />
        <Picker.Item label="4" value={4} />
      </Picker>

      {Array.from({ length: numMembers }).map((_, index) => (
        <TextInput
          key={index}
          placeholder={`Member ${index + 1} Email`}
          value={memberEmails[index]}
          onChangeText={(value) => handleEmailChange(index, value)}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
      ))}

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <Button title="Register" onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

export default TeamRegister;
