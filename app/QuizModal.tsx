import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { Client, Databases } from 'appwrite'; // Appwrite SDK

const QuizModal = ({ visible, onClose, apicontentId }) => { // apicontentId를 props로 받음
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      const fetchQuizData = async () => {
        try {
          // Appwrite 클라이언트 설정
          const client = new Client();
          client
            .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite 엔드포인트 설정
            .setProject('66faafc9002ad8bed1f6'); // Appwrite 프로젝트 ID 설정

          const databases = new Databases(client);
          // Appwrite 데이터베이스에서 퀴즈 데이터 가져오기
          const response = await databases.listDocuments('66fab2bc000944d087a5', '66fbe65b000af4eebfb7');

          console.log('Fetched quiz data:', response); // 응답 데이터 로그 출력

          // contentId가 apicontentId와 일치하는 데이터 필터링
          const filteredQuizData = response.documents.filter(quiz => quiz.contentId === apicontentId);
          console.log('Filtered quiz data:', filteredQuizData); // 필터링된 데이터 로그 출력

          setQuizData(filteredQuizData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quiz data:', error.message);
          setLoading(false);
        }
      };

      fetchQuizData(); // 모달이 열릴 때 데이터를 가져옴
    }
  }, [visible, apicontentId]); // apicontentId를 의존성 배열에 추가하여 변경 시 새로 고침

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : quizData.length > 0 ? ( // quizData가 비어있지 않은지 확인
            <>
              <Text style={styles.title}>Quiz</Text>
              {quizData.map((quiz, index) => (
                <View key={index} style={styles.quizItem}>
                  <Text>{quiz.question ? quiz.question : 'No question available'}</Text>
                </View>
              ))}
              <Button title="Close" onPress={onClose} />
            </>
          ) : (
            <Text>No quiz data available</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quizItem: {
    marginVertical: 10,
  },
});

export default QuizModal;
