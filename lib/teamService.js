import { Client, Databases, ID, Permission, Role, Query } from "appwrite";
import { config } from "./appwrite"; // Import the configuration

const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);

const database = new Databases(client);

// Create a new team
export const createTeam = async (teamName, teamLeaderId, memberEmails) => {
  try {
    // Ensure a unique team ID is generated
    const documentId = ID.unique();

    const response = await database.createDocument(
      config.databaseId,
      config.teamCollectionId, // Use your teams collection ID from Appwrite
      documentId,
      {
        team_name: teamName,
        team_leader: teamLeaderId,
        members: memberEmails,
        score: 0, // Initialize score to 0
      },
      [
        Permission.read(Role.any()), // Allow any user to view team info
        Permission.update(`user:${teamLeaderId}`), // Only the leader can update team info
      ]
    );

    return response;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error(error.message);
  }
};

export const getTeamDetails = async (leaderId) => {
  try {
    const response = await database.listDocuments(
      config.databaseId,
      config.teamCollectionId,
      [Query.equal("team_leader", leaderId)] // Query by team leader's ID
    );

    return response.documents.length > 0 ? response.documents[0] : null;
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw new Error(error.message);
  }
};

export const updateTeam = async (teamId, newTeamName, newMembers) => {
  await database.updateDocument(
    "your_database_id",
    "teams_collection_id",
    teamId,
    {
      name: newTeamName,
      members: newMembers,
    }
  );
};
