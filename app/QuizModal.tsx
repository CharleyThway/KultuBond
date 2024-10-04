import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Client, Databases } from 'appwrite'; // Appwrite SDK

const QuizModal = ({ visible, onClose, apicontentId }) => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      const fetchQuizData = async () => {
        try {
          const client = new Client();
          client
            .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite 엔드포인트 설정
            .setProject('66faafc9002ad8bed1f6'); // Appwrite 프로젝트 ID 설정

          const databases = new Databases(client);
          const response = await databases.listDocuments('66fab2bc000944d087a5', '66fbe65b000af4eebfb7');

          console.log('Fetched quiz data:', response);

          const filteredQuizData = response.documents
            .filter(quiz => quiz.contentId === apicontentId)
            .map(quiz => ({
              ...quiz,
              selectedOption: null,
              isSubmitted: false,
            }));
          console.log('Filtered quiz data:', filteredQuizData);

          setQuizData(filteredQuizData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching quiz data:', error.message);
          setLoading(false);
        }
      };

      fetchQuizData();
    }
  }, [visible, apicontentId]);

  const handleSubmitAnswer = (index) => {
    const updatedQuizData = [...quizData];
    const selectedOption = updatedQuizData[index].selectedOption;

    if (selectedOption === updatedQuizData[index].answer) {
      Alert.alert('That\'s correct! You get 4 points.'); //정답일때. 여기에 실제로 점수추가 하기.
    } else {
      Alert.alert("That's wrong!", `The correct answer is \"${updatedQuizData[index].answer}\"`);
    }

    updatedQuizData[index].isSubmitted = true; // 선택한 문제만 제출 상태 변경
    setQuizData(updatedQuizData);
  };

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
                  <Text>{quiz.intro ? quiz.intro : null}</Text>
                  <Text style={{ marginVertical: 10, fontWeight: 'bold' }}>
                  {quiz.question ? quiz.question : 'No question available'}
                  </Text>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {quiz.options && quiz.options.map((option, idx) => (
                    <View key={idx} style={{ width: '48%', marginVertical: 5 }}>
                    <TouchableOpacity
                    onPress={() => handleOptionSelect(index, option)}
                    disabled={quiz.isSubmitted}
                    style={{
                      backgroundColor: quiz.selectedOption === option ? '#14122D' : '#B7C9E6',
                      padding: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                    </View>
                  ))}
                  </View>

                  {/* "정답제출" 버튼 조건부 렌더링 */}
                  
                    <Button
                      title="Submit Answer"
                      onPress={() => handleSubmitAnswer(index)} 
                      color={quiz.selectedOption ? '#A3D2E3' : '#B7C9E6'} // 선택된 옵션이 있을 경우 진한 색상, 없을 경우 연한 색상
                      disabled={quiz.isSubmitted || !quiz.selectedOption} 
                    />
                  

                  <Text>{quiz.ps ? quiz.ps : null}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>CLOSE</Text>
              </TouchableOpacity>
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
    backgroundColor: '#14122D', //'rgba(0, 0, 0, 0.5)' 이렇게하면 뒤에 배경이 보임(투명)
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
  button: {
    backgroundColor: '#B7C9E6', // 원하는 색상으로 변경
    padding: 10,
    borderRadius: 5,
    paddingVertical: 7
  },
  buttonText: {
    color: '#14122D',
    fontSize: 14, // 원하는 글자 크기로 변경
    textAlign: 'center',
  },
});

export default QuizModal;