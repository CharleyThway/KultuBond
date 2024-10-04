import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { getTeamInfo, updateTeam } from "../../lib/teamService"; // Add necessary functions
import { useGlobalContext } from "../../context/GlobalProvider";

const MyTeam = () => {
  const { user } = useGlobalContext();
  const [teamInfo, setTeamInfo] = useState(null); // Stores team details
  const [isEditing, setIsEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newMembers, setNewMembers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the team information on load
    const fetchTeamInfo = async () => {
      try {
        const team = await getTeamInfo(user.$id); // Assumes user.$id is the leader or member
        setTeamInfo(team);
        setNewTeamName(team.teamName);
        setNewMembers(team.members);
      } catch (err) {
        setError("Failed to load team information.");
      }
    };
    fetchTeamInfo();
  }, [user.$id]);

  const handleAddMember = () => {
    if (newMembers.length < 4) {
      setNewMembers([...newMembers, ""]);
    }
  };

  const handleRemoveMember = (index) => {
    setNewMembers(newMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, email) => {
    const updatedMembers = [...newMembers];
    updatedMembers[index] = email;
    setNewMembers(updatedMembers);
  };

  const handleSaveChanges = async () => {
    if (newMembers.length > 4) {
      setError("You cannot have more than 4 members.");
      return;
    }
    try {
      await updateTeam(teamInfo.teamId, newTeamName, newMembers);
      setIsEditing(false);
      alert("Team updated successfully.");
    } catch (err) {
      setError("Failed to update team.");
    }
  };

  if (!teamInfo) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>My Team</Text>

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <View>
        <Text>
          Team Name:{" "}
          {isEditing ? (
            <TextInput value={newTeamName} onChangeText={setNewTeamName} />
          ) : (
            teamInfo.teamName
          )}
        </Text>
        <Text>Leader: {teamInfo.leaderName}</Text>
        <Text>Members:</Text>
        {isEditing
          ? newMembers.map((member, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <TextInput
                  value={member}
                  onChangeText={(email) => handleMemberChange(index, email)}
                  placeholder={`Member ${index + 1} Email`}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Remove"
                  onPress={() => handleRemoveMember(index)}
                />
              </View>
            ))
          : teamInfo.members.map((member, index) => (
              <Text key={index}>{member}</Text>
            ))}
        {isEditing && newMembers.length < 4 && (
          <Button title="Add Member" onPress={handleAddMember} />
        )}
      </View>

      {user.$id === teamInfo.leaderId && (
        <View>
          {isEditing ? (
            <Button title="Save Changes" onPress={handleSaveChanges} />
          ) : (
            <Button title="Edit Team" onPress={() => setIsEditing(true)} />
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default MyTeam;
