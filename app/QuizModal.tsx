import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Client, Databases } from 'appwrite'; // Appwrite SDK

const QuizModal = ({ visible, onClose, apicontentId }) => {
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
          const filteredQuizData = response.documents
            .filter(quiz => quiz.contentId === apicontentId)
            .map(quiz => ({
              ...quiz,
              selectedOption: null, // 각 문제의 선택된 옵션 초기화
              isSubmitted: false,   // 각 문제의 제출 상태 초기화
            }));
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
  }, [visible, apicontentId]);

  // 정답 제출 처리 함수
  const handleSubmitAnswer = (index) => {
    const updatedQuizData = [...quizData];
    const selectedOption = updatedQuizData[index].selectedOption;

    if (selectedOption === updatedQuizData[index].answer) {
      Alert.alert('That\'s correct! You get 4 points.');
    } else {
      Alert.alert("That's wrong!", `The correct answer is \"${updatedQuizData[index].answer}\"`);
    }

    updatedQuizData[index].isSubmitted = true; // 선택한 문제만 제출 상태 변경
    setQuizData(updatedQuizData);
  };

  // 옵션 선택 처리 함수
  const handleOptionSelect = (index, option) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[index].selectedOption = option; // 선택된 옵션 저장
    setQuizData(updatedQuizData);
  };

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
          ) : quizData.length > 0 ? (
            <>
              <Text style={styles.title}>Quiz</Text>
              {quizData.map((quiz, index) => (
                <View key={index} style={styles.quizItem}>
                  {/* 질문 표시 */}
                  <Text>{quiz.intro ? quiz.intro : null}</Text>
                  <Text>{quiz.question ? quiz.question : 'No question available'}</Text>

                  {/* 옵션 버튼 표시 */}
                  {quiz.options && quiz.options.map((option, idx) => (
                    <Button
                      key={idx}
                      title={option}
                      onPress={() => handleOptionSelect(index, option)} // 각 문제의 옵션 선택
                      color={quiz.selectedOption === option ? 'green' : 'blue'} // 선택된 옵션 색상 변경
                      disabled={quiz.isSubmitted} // 정답 제출 후 버튼 비활성화
                    />
                  ))}

                  {/* 정답 제출 버튼 */}
                  <Button
                    title="정답제출"
                    onPress={() => handleSubmitAnswer(index)} // 각 문제별로 제출
                    disabled={quiz.isSubmitted || !quiz.selectedOption} // 정답 제출 후 비활성화, 선택이 없으면 비활성화
                  />

                <Text>{quiz.ps ? quiz.ps : null}</Text>
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
