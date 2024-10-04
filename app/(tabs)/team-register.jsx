import React, { useState } from "react";
import { View, TextInput, Text, Button } from "react-native";
import { createTeam } from "../../lib/teamService";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native"; // Use navigation to go to My Team

const TeamRegister = () => {
  const { user } = useGlobalContext();
  const navigation = useNavigation(); // Initialize navigation
  const [teamName, setTeamName] = useState("");
  const [numMembers, setNumMembers] = useState(1); // Default to 1 member
  const [memberEmails, setMemberEmails] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMemberCountChange = (value) => {
    setNumMembers(value);

    // Adjust the memberEmails array to match the number of members
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
      navigation.navigate("MyTeam"); // Redirect to My Team page
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

      {/* Replace number input with Picker */}
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
        <Picker.Item label="5" value={5} />
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
