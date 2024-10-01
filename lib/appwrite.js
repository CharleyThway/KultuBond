import { Client, Account, Avatars, Databases, ID, Storage  } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.trio.kultubond",
  projectId: "66faafc9002ad8bed1f6",
  databaseId: "66fab2bc000944d087a5",
  userCollectionId: "66fab2e3003470cd78b6",
  storageId: "66fab4710008a01e7c8c",
};


// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  //.setPlatform(config.platform);

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
  ) => {
    try {
      // Create the user
      const response = await account.create(ID.unique(), email, password, username);
      const avatarUrl = avatars.getInitials(username);
      
      // Create the user document in your database
      const userDocument = {
        username,
        email,
        avatar: avatarUrl, // Set to null or provide a default avatar URL
        accountId: response.$id, // Use the response ID for accountId
        full_name: fullName,
        wyd_code: wydCode,
        mbti,
        travel_preferences: travelPreference,
        country: "Your country", // Ensure this is provided correctly
        introduction: "Introduction", // Ensure this is provided correctly
      };
  
      console.log('User Document:', userDocument); // Debugging log
  
      const documentId = ID.unique(); // Generate a unique ID for the document
      await database.createDocument(config.databaseId, config.userCollectionId, documentId, userDocument);
    
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  

// Get the current user (if logged in)
export const getCurrentUser = async () => {
  try {
    const response = await account.get();
    return response;
  } catch (error) {
    throw new Error("Unable to fetch current user.");
  }
};

// Upload an avatar file (optional)
/* export const uploadFile = async (file) => {
  try {
    const response = await storage.createFile(
      config.avatarsBucketId, // Bucket ID for avatars
      ID.unique(), // Generate a unique ID for the file
      file // The file object to be uploaded
    );
    return response.$id; // Return the file ID or URL for further use
  } catch (error) {
    throw new Error("File upload failed");
  }
}; */


// Log in the user
export const loginUser = async (email, password) => {
  try {
    const response = await account.createEmailSession(email, password);
    return response;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials.");
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    await account.deleteSession('current'); // Log out the current session
  } catch (error) {
    throw new Error("Logout failed.");
  }
};

export default client;