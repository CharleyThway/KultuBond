import { Client, Databases, ID, Permission, Role } from "appwrite";
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
