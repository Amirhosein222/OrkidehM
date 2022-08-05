import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReadMore from 'react-native-read-more-text';

const ReadMoreText = ({ text }) => {
  const handleTextReady = () => {
    // console.log('ready!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ReadMore numberOfLines={2} onReady={handleTextReady}>
          <Text style={styles.cardText}>{text}</Text>
        </ReadMore>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 3,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 14,
  },
});

export default ReadMoreText;
