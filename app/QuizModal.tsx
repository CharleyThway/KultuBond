import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { Client, Databases } from 'appwrite'; // Appwrite SDK

const QuizModal = ({ visible, onClose }) => {
  const [quizData, setQuizData] = useState(null);
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
          setQuizData(response.documents); // 가져온 퀴즈 데이터를 상태로 저장
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quiz data:', error.message); // 문자열로 에러 메시지 출력
          setLoading(false);
        }
      };

      fetchQuizData(); // 모달이 열릴 때 데이터를 가져옴
    }
  }, [visible]);

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
          ) : quizData ? (
            <>
              <Text style={styles.title}>Quiz</Text>
              {quizData.map((quiz, index) => (
                <View key={index} style={styles.quizItem}>
                  {/* quiz.question이 존재하는지 확인 */}
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
