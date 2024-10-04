import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import {
  getCurrentUser,
  getTeamDetails,
  getUserById,
  getUserByEmail,
  updateTeamDetails, // Import the function to update the team
} from "../lib/appwrite";
import EditTeamModal from "../components/EditTeamModal"; // Import the EditTeamModal component

const MyTeam = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [memberNames, setMemberNames] = useState([]);
  const [error, setError] = useState(null);
  const [isLeader, setIsLeader] = useState(false); // Track if the current user is the leader
  const [showModal, setShowModal] = useState(false); // State for showing/hiding the modal

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        // Fetch current user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          throw new Error("No logged-in user found");
        }

        console.log("Current User ID:", currentUser.$id);

        // Fetch team details for the current user
        const response = await getTeamDetails(currentUser.$id);
        if (
          !response ||
          !response.documents ||
          response.documents.length === 0
        ) {
          throw new Error("No team found for this user");
        }

        const teamData = response.documents[0];
        console.log("Team details:", teamData);

        // Check if the current user is the team leader
        setIsLeader(currentUser.$id === teamData.team_leader);

        // Fetch team leader's full name
        const leader = await getUserById(teamData.team_leader);
        setTeamLeaderName(leader.full_name);

        // Fetch full names of team members by their emails
        const memberNamePromises = teamData.members.map(async (email) => {
          const member = await getUserByEmail(email);
          return member.full_name;
        });

        const names = await Promise.all(memberNamePromises);
        setMemberNames(names);

        // Set the team data
        setTeam(teamData);
      } catch (err) {
        console.error("Error fetching team details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamDetails();
  }, []);

  const handleUpdateTeam = async (updatedTeam) => {
    // Handle the update logic
    try {
      await updateTeamDetails(team.$id, updatedTeam); // Update the team details in the Appwrite DB
      setTeam(updatedTeam); // Update the state with new team details
    } catch (error) {
      console.error("Error updating team:", error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading team details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>
          Failed to load team details: {error}
        </Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.centered}>
        <Text>No team found for this user.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Name: {team.team_name}</Text>
      <Text>Team Leader: {teamLeaderName}</Text>
      <Text>Members:</Text>
      {memberNames.map((name, index) => (
        <Text key={index}>- {name}</Text>
      ))}
      <Text>Score: {team.score}</Text>

      {/* Show the Edit button only to the team leader */}
      {isLeader && (
        <Button
          title="Edit Team"
          onPress={() => setShowModal(true)} // Show the modal when clicked
        />
      )}

      {/* Edit Team Modal */}
      <EditTeamModal
        visible={showModal}
        team={team}
        onClose={() => setShowModal(false)} // Close the modal
        onSubmit={handleUpdateTeam} // Update the team when the form is submitted
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default MyTeam;
