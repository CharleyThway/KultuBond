import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Client, Databases } from 'appwrite'; // Appwrite SDK 가져오기

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]); // 필터링된 퀴즈 상태

  useEffect(() => {
    const client = new Client();
    client.setEndpoint('https://cloud.appwrite.io/v1').setProject('66faafc9002ad8bed1f6');
    
    const databases = new Databases(client);
    const getData = async () => {
      try {
        const response = await databases.listDocuments('66fab2bc000944d087a5', '66fbe65b000af4eebfb7');
        const allQuizzes = response.documents;

        // 특정 contentId로 필터링, 여기서 직접 원하는 contentId를 넣음
        const specificContentId = '264337'; // 여기에 필터링하고자 하는 contentId를 직접 넣음
        const filtered = allQuizzes.filter((quiz) => quiz.contentId === specificContentId);

        setFilteredQuizzes(filtered);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    getData();
  }, []);

  return (
    <View>
      <Text>Filtered Quiz List</Text>
      <FlatList
        data={filteredQuizzes}
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


