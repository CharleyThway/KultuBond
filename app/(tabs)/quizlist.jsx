import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Client, Databases } from 'appwrite'; // Appwrite SDK 가져오기

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const client = new Client();
    client.setEndpoint('https://cloud.appwrite.io/v1').setProject('66faafc9002ad8bed1f6');
    
    const databases = new Databases(client);
    const getData = async () => {
      try {
        const response = await databases.listDocuments('66fab2bc000944d087a5', '66fbe65b000af4eebfb7');
        setQuizzes(response.documents);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    getData();
  }, []);

  return (
    <View>
      <Text>Quiz List</Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.quizId}
        renderItem={({ item }) => (
          <View>
            <Text>{item.question}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Quiz;
