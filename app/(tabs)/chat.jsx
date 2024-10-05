import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, ActivityIndicator, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { getCurrentUser, getUserProfile, createPost, fetchPosts } from '../../lib/appwrite'; // Import createPost function
import useAppwrite from '../../lib/useAppwrite';

const Chat = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const { data: currentUser, loading: loadingUser } = useAppwrite(getCurrentUser);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const profile = await getUserProfile(currentUser.$id);
          if (profile) {
            setUserProfile(profile);
          } else {
            console.error("User profile not found");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserProfile();
  }, [currentUser]);
  
  const loadPosts = async () => {
    const fetchedPosts = await fetchPosts();
    setPosts(fetchedPosts.documents);
  };

  loadPosts();
  const handlePostSubmit = async () => {
    if (content && userProfile) { // Ensure userProfile is defined
      const newPost = {
        userId: currentUser.$id,
        username: userProfile.username, // Use username from userProfile
        content,
        createdAt: new Date().toISOString(), // Set the current date and time
      };

      try {
        // Send the new post to the Appwrite database
        const response = await createPost(newPost.userId, newPost.username, newPost.content); // Pass userId, username, content
        setPosts((prevPosts) => [newPost, ...prevPosts]); // Update posts array with new post
        setContent(''); // Clear the input field
      } catch (error) {
        console.error("Error creating post:", error);
      }
    } else {
      console.error("Content or username is missing");
    }
  };

  if (loading || loadingUser) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      {userProfile ? (
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20, resizeMode: "contain" }}
              source={{ uri: userProfile.avatar || "https://cdn-icons-png.flaticon.com/128/149/149071.png" }} // Use avatar from userProfile
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Welcome, {userProfile.username}</Text>
          </View>

          <TextInput
            value={content}
            onChangeText={(text) => setContent(text)}
            placeholder="Type your message..."
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
            multiline
          />
          <TouchableOpacity className="bg-gray-400">
          <Button onPress={handlePostSubmit} title="Share Post" />
          </TouchableOpacity>

          {/* FlatList to display posts */}
          <FlatList
            data={posts}
            keyExtractor={(item) => item.createdAt} // Use the timestamp as the unique key
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                <Text>{item.content}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <Text>No user profile found.</Text>
      )}
    </SafeAreaView>
  );
};

export default Chat;
