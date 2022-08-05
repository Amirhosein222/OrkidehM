/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList, ActivityIndicator } from 'react-native';

import getLoginClient from '../../libs/api/loginClientApi';

import {
  Container,
  TabBar,
  Header,
  Snackbar,
  Text,
} from '../../components/common';
import { PsychologyTestCard } from '../../components/PsychologyTests';

import { useIsPeriodDay } from '../../libs/hooks';
import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';
import { showSnackbar } from '../../libs/helpers';

const PsychologyTestsScreen = ({ navigation }) => {
  const isPeriodDay = useIsPeriodDay();
  const [testsList, setTestsList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });

  const getTests = async function () {
    const loginClient = await getLoginClient();
    loginClient.get('test/list/index?gender=man').then((response) => {
      if (response.data.is_successful) {
        setIsFetching(false);
        setTestsList(response.data.data);
      } else {
        setIsFetching(false);
        setSnackbar({
          msg: 'متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید',
          visible: true,
        });
      }
    });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const showAlert = (msg) => {
    showSnackbar(msg);
  };

  const RenderTests = function ({ item }) {
    return (
      <PsychologyTestCard
        testTitle={item.title}
        description={item.description}
        testId={item.id}
        navigation={navigation}
        showAlert={showAlert}
      />
    );
  };

  useEffect(() => {
    getTests();
  }, []);

  if (isFetching === true) {
    return (
      <Container justifyContent="center">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.blue}
        />
      </Container>
    );
  } else if (testsList.length === 0) {
    return (
      <Container justifyContent="space-between">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
        />
        <Text large color={isPeriodDay ? COLORS.rossoCorsa : COLORS.blue}>
          در حال حاضر هیچ تستی وجود ندارد!
        </Text>

        <TabBar seperate={true} navigation={navigation} />
      </Container>
    );
  } else {
    return (
      <Container justifyContent="flex-start">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header
          navigation={navigation}
          style={{ marginTop: STATUS_BAR_HEIGHT + rh(2), margin: 0 }}
        />
        <FlatList
          data={testsList}
          keyExtractor={(item) => item.id}
          renderItem={RenderTests}
          style={{ marginTop: 20 }}
          contentContainerStyle={{
            marginBottom: rh(2),
            width: rw(90),
          }}
        />
        <TabBar seperate={true} navigation={navigation} />
        {snackbar.visible === true ? (
          <Snackbar
            message={snackbar.msg}
            type={snackbar.type}
            handleVisible={handleVisible}
          />
        ) : null}
      </Container>
    );
  }
};

export default PsychologyTestsScreen;
