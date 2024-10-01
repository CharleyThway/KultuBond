import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';

interface MarkerModalProps {
  visible: boolean;
  title: string;
  overview: string;
  firstImage?: string;
  homepage?: string; // homepage 프로퍼티 추가
  onClose: () => void;
  onQuizPress: () => void;
}

const MarkerModal: React.FC<MarkerModalProps> = ({ visible, title, overview, firstImage, homepage, onClose, onQuizPress }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        
        {firstImage ? (
          <Image source={{ uri: firstImage }} style={styles.image} />
        ) : (
          <Text>No Image Available</Text>
        )}
        
        <Text>{overview}</Text> 

        {homepage && (
          <TouchableOpacity onPress={() => Linking.openURL(homepage)} style={styles.link}>
            <Text style={styles.linkText}>Visit Homepage</Text>
          </TouchableOpacity>
        )}

        <Button title="Start Quiz" onPress={onQuizPress} />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  link: {
    marginVertical: 10,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default MarkerModal;
