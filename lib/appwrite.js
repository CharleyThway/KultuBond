// import {
//   Account,
//   Avatars,
//   Client,
//   Databases,
//   ID,
//   Query,
//   Storage,
// } from "react-native-appwrite";

// export const appwriteConfig = {
//   endpoint: "https://cloud.appwrite.io/v1",
//   platform: "com.trio.kultubond",
//   projectId: "66faafc9002ad8bed1f6",
//   databaseId: "66fab2bc000944d087a5",
//   userCollectionId: "66fab2e3003470cd78b6",
//   chatRoomCollectionId: "66fbaec600130320aa11",
//   messageCollectionId: "66fbb1df000cc198d25e",
//   storageId: "66fab4710008a01e7c8c",
// };

// // Init your React Native SDK
// const client = new Client();

// client
//   .setEndpoint(appwriteConfig.endpoint)
//   .setProject(appwriteConfig.projectId)
//   .setPlatform(appwriteConfig.platform);

// const account = new Account(client);
// const storage = new Storage(client);
// const avatars = new Avatars(client);
// const databases = new Databases(client);

// // Get Account
// export async function getAccount() {
//   try {
//     const currentAccount = await account.get();

//     return currentAccount;
//   } catch (error) {
//     throw new Error(error);
//   }
// }

// // Get Current User
// export async function getCurrentUser() {
//   try {
//     const currentAccount = await getAccount();
//     if (!currentAccount) throw Error;

//     const currentUser = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       [Query.equal("accountId", currentAccount.$id)]
//     );

//     if (!currentUser) throw Error;

//     return currentUser.documents[0];
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

// export async function getChatRooms(userId) {
//   try {
//     const rooms = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       "chatrooms",
//       [
//         Query.or([
//           Query.equal("user1Id", userId),
//           Query.equal("user2Id", userId),
//         ]),
//       ]
//     );
//     return rooms.documents;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export async function getMessages(roomId) {
//   try {
//     const messages = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       "messages",
//       [Query.equal("roomId", roomId)]
//     );
//     return messages.documents;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export async function sendMessage(roomId, senderId, message) {
//   try {
//     const newMessage = await databases.createDocument(
//       appwriteConfig.databaseId,
//       "messages",
//       {
//         roomId,
//         senderId,
//         message,
//         timestamp: new Date(),
//       }
//     );
//     return newMessage;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

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
