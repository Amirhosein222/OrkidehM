/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import { Text, Divider } from '../common';
import { COLORS } from '../../configs';

const TestOptions = ({
  option,
  getSelectedAnswer,
  selectedOpt,
  questionId,
}) => {
  const [options, setOptions] = useState({ ...option, checked: false });

  const handleSelectedAnswer = function (answer) {
    answer.checked = !answer.checked;
    setOptions({ ...options, ...answer });
    // setSelectedOpt(options.id);
    getSelectedAnswer(answer.question_id, answer.id);
  };

  return (
    <View>
      <Text margin="20" small>
        {testDetails.description}
      </Text>
      <Button
        mode={
          selectedOpt.qId === options.question_id &&
          selectedOpt.oId === option.id
            ? 'contained'
            : 'outlined'
        }
        color={COLORS.blue}
        style={styles.btn}
        onPress={() => handleSelectedAnswer(option)}>
        <Text
          color={
            selectedOpt.qId === options.question_id &&
            selectedOpt.oId === option.id
              ? COLORS.white
              : COLORS.blue
          }>
          {options.title}
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '80%',
    height: 40,
    margin: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cardContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  cardBtn: {
    width: '30%',
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    marginLeft: 5,
  },
});

export default TestOptions;
