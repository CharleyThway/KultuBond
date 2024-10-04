import { Client, Account, Avatars, Databases, ID, Storage } from "react-native-appwrite";

// Appwrite configuration
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.trio.kultubond",
  projectId: "66faafc9002ad8bed1f6",
  databaseId: "66fab2bc000944d087a5",
  userCollectionId: "66fab2e3003470cd78b6",
  storageId: "66fab4710008a01e7c8c",
};

// Initialize Appwrite client
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
    // Create the user with Appwrite account service
    const response = await account.create(ID.unique(), email, password, username);
    console.log('User created:', response); 

    // Generate user avatar using initials
    const avatarUrl = avatars.getInitials(username);

    // Create the user document in the Appwrite database
    const userDocument = {
      username,
      email,
      avatar: avatarUrl,
      accountId: response.$id,
      full_name: fullName,
      wyd_code: wydCode,
      mbti,
      travel_preferences: travelPreference,
      country,
      introduction,
    };

    const documentId = ID.unique();
    await database.createDocument(config.databaseId, config.userCollectionId, documentId, userDocument);

    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message);
  }
};

// Get the currently logged-in user
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    console.log("Fetched Current User:", user);
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// Get user's profile by accountId
export const getUserProfile = async (accountId) => {
  try {
    const response = await database.listDocuments(config.databaseId, config.userCollectionId);
    console.log("Fetched documents:", response.documents); // Log fetched documents
    console.log("Searching for accountId:", accountId); // Log the accountId being searched

    const userProfile = response.documents.find(doc => {
      if (typeof doc.accountId !== 'string') {
        console.warn("Unexpected accountId type:", typeof doc.accountId); // Log unexpected type
        return false; // Skip this document
      }
    
      // Check if accountId is defined before trimming
      const docAccountId = doc.accountId.trim(); // Trim whitespace
      const trimmedAccountId = typeof accountId === 'string' ? accountId.trim() : null; // Check type before trimming

      // If trimmedAccountId is null, we can't do a comparison
      if (trimmedAccountId === null) {
        console.warn("Provided accountId is not a valid string.");
        return false; // Skip comparison if invalid
      }
    
      console.log("Checking document accountId:", docAccountId); // Log each document's accountId
      console.log("Provided accountId:", trimmedAccountId); // Log the provided accountId
    
      return docAccountId === trimmedAccountId; // Compare both
    });
    
    if (!userProfile) {
      throw new Error("User profile not found.");
    }

    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};



// Update user's profile
export const updateUserProfile = async (accountId, updatedData) => {
  try {
    // Get the user's existing profile first
    const response = await database.listDocuments(config.databaseId, config.userCollectionId);
    const userProfile = response.documents.find(doc => doc.accountId === accountId);

    if (!userProfile) {
      throw new Error("User profile not found.");
    }

    // Now update the user document with the provided updated data
    const updatedResponse = await database.updateDocument(
      config.databaseId,
      config.userCollectionId,
      userProfile.$id, // Use the document ID for the update
      updatedData
    );

    console.log('User profile updated:', updatedResponse);
    return updatedResponse;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error("Failed to update user profile.");
  }
};


// Log in the user
export const loginUser = async (email, password) => {
  try {
    const response = await account.createEmailPasswordSession(email, password);
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed. Please check your credentials.");
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
    console.log('User logged out successfully.');
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Logout failed.");
  }
};

export default client;
