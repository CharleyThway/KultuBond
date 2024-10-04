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

// Create a new chat room between two users
export const createChatRoom = async (user1Id, user2Id) => {
  try {
    console.log("User 1 ID:", user1Id);
    console.log("User 2 ID:", user2Id);

    const chatRoomId = [user1Id, user2Id].sort().join("_").substring(0, 25); // Ensure length is 25 characters

    // Check if chatroom already exists
    const existingRooms = await database.listDocuments(
      config.databaseId,
      config.chatCollectionId,
      [Query.equal("chatRoomId", chatRoomId)]
    );

    if (existingRooms.total > 0) {
      return existingRooms.documents[0].$id; // Return existing chat room
    }

    // Create a new chat room with permissions for both users
    const response = await database.createDocument(
      config.databaseId,
      config.chatCollectionId,
      ID.unique(),
      { user1Id, user2Id, chatRoomId },
      [
        Permission.read(["user:" + user1Id]), // Grant read permission to user1
        Permission.read(["user:" + user2Id]), // Grant read permission to user2
        Permission.update(["user:" + user1Id]), // Allow user1 to update the chat
        Permission.update(["user:" + user2Id]), // Allow user2 to update the chat
      ]
    );
    return response.$id;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw new Error("Failed to create chat room.");
  }
};

// Send a message in a chat room
export const sendMessage = async (chatRoomId, senderId, message) => {
  try {
    await database.createDocument(
      config.databaseId,
      config.messageCollectionId, // Use messageCollectionId from config
      ID.unique(),
      {
        chatRoomId,
        senderId,
        message,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message.");
  }
};

// Fetch messages from a chat room
export const fetchMessages = async (chatRoomId) => {
  try {
    const response = await database.listDocuments(
      config.databaseId,
      "Messages",
      [Query.equal("chatRoomId", chatRoomId), Query.orderAsc("timestamp")]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export default client;
