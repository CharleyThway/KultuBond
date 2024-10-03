import { Client, Databases, Query } from "appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.trio.kultubond",
  projectId: "66faafc9002ad8bed1f6",
  databaseId: "66fab2bc000944d087a5",
  userCollectionId: "66fab2e3003470cd78b6",
  chatRoomCollectionId: "66fbaec600130320aa11",
  messageCollectionId: "66fbb1df000cc198d25e",
  storageId: "66fab4710008a01e7c8c",
};

// Init your React Native SDK
const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId);

// Databases instance
const databases = new Databases(client);

// Function to fetch users from Appwrite collection
export const fetchUsers = async (searchTerm = "") => {
  try {
    let queries = [];

    // If there is a search term, use Query.equal for exact match
    if (searchTerm) {
      queries.push(Query.equal("username", searchTerm));
      queries.push(Query.equal("full_name", searchTerm));
    }

    // Fetch users from Appwrite
    const response = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      queries.length > 0 ? queries : [] // Fetch all users if no search query
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
