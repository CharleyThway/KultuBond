import {
  Client,
  Account,
  Avatars,
  Databases,
  ID,
  Storage,
  Query,
  Permission,
  Role,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.trio.kultubond",
  projectId: "66faafc9002ad8bed1f6",
  databaseId: "66fab2bc000944d087a5",
  userCollectionId: "66fab2e3003470cd78b6",
  chatCollectionId: "66fbaec600130320aa11",
  messageCollectionId: "66fbb1df000cc198d25e",
  storageId: "66fab4710008a01e7c8c",
  teamCollectionId: "66fff7d9000d0f708e53",
};

// Init your React Native SDK
const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId);

const account = new Account(client);
const database = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

// Create a new user
export const createUser = async (
  username,
  email,
  password,
  fullName,
  wydCode,
  mbti,
  travelPreference,
  country,
  introduction
) => {
  try {
    // Create the user
    const response = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    console.log("User created:", response); // Log the created user response
    const avatarUrl = avatars.getInitials(username);

    // Create the user document in your database
    const userDocument = {
      username,
      email,
      avatar: avatarUrl,
      accountId: response.$id,
      full_name: fullName,
      wyd_code: wydCode,
      mbti,
      travel_preferences: travelPreference,
      country: country,
      introduction: introduction,
    };

    console.log("User Document:", userDocument); // Log the user document before saving

    const documentId = ID.unique();
    await database.createDocument(
      config.databaseId,
      config.userCollectionId,
      documentId,
      userDocument
    );

    return response;
  } catch (error) {
    console.error("Error creating user:", error); // Log error if creation fails
    throw new Error(error.message);
  }
};
// Make sure this function is returning the expected result
export const getCurrentUser = async () => {
  try {
    const user = await account.get(); // Assuming Appwrite account SDK
    return user;
  } catch (error) {
    return null;
  }
};

// Log in the user
export const loginUser = async (email, password) => {
  try {
    const response = await account.createEmailPasswordSession(email, password);
    console.log("Login successful:", response); // Log the session response
    return response;
  } catch (error) {
    console.error("Error during login:", error); // Log the error for login
    throw new Error("Login failed. Please check your credentials.");
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    console.log("User logged out successfully."); // Log logout success
  } catch (error) {
    console.error("Error during logout:", error); // Log logout error
    throw new Error("Logout failed.");
  }
};

// Function to create a new team
export const createTeam = async (teamName, leaderId, memberEmails) => {
  try {
    const documentId = ID.unique();

    const teamData = {
      teamName,
      leaderId,
      memberEmails,
      scores: 0, // Initialize the team score to 0
    };

    // Create an array for read/write permissions, including leader and members
    const permissions = [
      Permission.read(`user:${leaderId}`), // Leader can read
      Permission.write(`user:${leaderId}`), // Leader can write
    ];

    // Add read/write permissions for each team member
    memberEmails.forEach((email) => {
      permissions.push(Permission.read(`user:${email}`));
      permissions.push(Permission.write(`user:${email}`)); // Members can also write (to add new members)
    });

    const response = await database.createDocument(
      config.databaseId,
      config.teamsCollectionId, // Define the collection ID for teams
      documentId,
      teamData,
      permissions
    );

    return response;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create the team.");
  }
};
