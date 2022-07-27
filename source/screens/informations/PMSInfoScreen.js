// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
  Container,
  Divider,
  Text,
  Image,
  RowContainer,
} from '../../components/common';
import { Bars } from '../../components/charts';

import { COLORS } from '../../configs';

const PMSInfoScreen = ({}) => {
  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <RowContainer marginTop="20px">
        <Text>میانگین داده شما در طول 6 دوره آخر</Text>
        <Icon name="long-arrow-alt-left" color={COLORS.blue} size={25} />
        <Text small bold>
          پی ام اس شما
        </Text>
      </RowContainer>
      <RowContainer justifyContent="center">
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/pa.png')}
            width="75px"
            height="75px"
          />
          <Text>1 بار</Text>
        </View>
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/de.png')}
            width="75px"
            height="75px"
          />
          <Text>2 بار</Text>
        </View>
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/se.png')}
            width="75px"
            height="75px"
          />
          <Text>1 بار</Text>
        </View>
        <View style={styles.pmsInfoCont}>
          <Image
            imageSource={require('../../assets/images/se.png')}
            width="75px"
            height="75px"
          />
          <Text>6 بار</Text>
        </View>
      </RowContainer>
      <Divider color={COLORS.blue} width="90%" />
      <Text
        alignSelf="flex-end"
        marginRight="20"
        marginTop="20"
        color={COLORS.blue}>
        مقایسه علائم PMS شما و همسالان شما
      </Text>

      <RowContainer justifyContent="space-evenly">
        <Image
          imageSource={require('../../assets/images/se.png')}
          width="75px"
          height="75px"
        />
        <Bars />
      </RowContainer>
      <RowContainer justifyContent="space-evenly">
        <Image
          imageSource={require('../../assets/images/pa.png')}
          width="75px"
          height="75px"
        />

        <Bars />
      </RowContainer>
      <RowContainer justifyContent="space-evenly">
        <Image
          imageSource={require('../../assets/images/de.png')}
          width="75px"
          height="75px"
        />

        <Bars />
      </RowContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  imgContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pmsInfoCont: {
    margin: 5,
  },
});

export default PMSInfoScreen;
