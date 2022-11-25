/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormData from 'form-data';

import { initPusher } from '../../../libs/helpers';
import getManClient from '../../../libs/api/manApi';
import {
  getSettings,
  getManInfo,
  getPusherUserId,
} from '../../../libs/apiCalls';
import { useIsPeriodDay, useApi } from '../../../libs/hooks';
import {
  WomanInfoContext,
  saveActiveRel,
} from '../../../libs/context/womanInfoContext';
import getLoginClient from '../../../libs/api/loginClientApi';
import { showSnackbar } from '../../../libs/helpers';

import {
  BackgroundView,
  Text,
  Header,
  Snackbar,
  NoRelation,
  Picker,
  ShowLovePopup,
} from '../../../components/common';

import { COLORS, STATUS_BAR_HEIGHT, rw, rh } from '../../../configs';
import Pregnancy from '../components/Pregnancy/Pregnancy';

const HomeScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const isPeriodDay = useIsPeriodDay();
  const {
    saveFullInfo,
    handleUserPeriodDays,
    handleUserCalendar,
    settings,
    saveSettings,
    saveAllSettings,
    getAndHandleRels,
    relations,
    activeRel,
    fetchingRels,
  } = useContext(WomanInfoContext);
  const [setts, setSetts] = useApi(() => getSettings(''));
  const [pusher, setPusher] = useApi(() => getPusherUserId(''));

  const [adsSettings, setAdsSetting] = useState(
    settings ? settings.app_text_need_support : null,
  );
  const [loginManInfo, setLoginManInfo] = useApi(() => getManInfo());
  const [pregnancy, setPregnancy] = useState(null);
  const [fetchingPreg, setFetchingPreg] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [resetPicker, setResetPicker] = useState(false);
  const [showLove, setShowLove] = useState(false);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const getPregnancyPercent = async function (relation) {
    setFetchingPreg(true);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'man');
    formData.append('relation_id', relation);
    loginClient.post('formula/pregnancy', formData).then(response => {
      setFetchingPreg(false);
      if (response.data.is_successful) {
        setPregnancy(response.data.data);
      } else {
        showSnackbar(response.data.message);
      }
    });
  };

  const getCalendar = async function (relation) {
    const manClient = await getManClient();
    const formData = new FormData();
    formData.append('relation_id', relation);
    manClient.post('show/calendar', formData).then(res => {
      if (res.data.is_successful) {
        const periodDays = res.data.data.filter(d => d.type === 'period');
        handleUserCalendar(res.data.data);
        handleUserPeriodDays(periodDays);
      } else {
        showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
      }
    });
  };

  const setActiveSpouse = async function (value) {
    if (typeof value === 'object') {
      return true;
    }
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', value);
    formData.append('gender', 'man');
    loginClient.post('active/relation', formData).then(response => {
      if (response.data.is_successful) {
        AsyncStorage.setItem(
          'lastActiveRelId',
          JSON.stringify(response.data.data.id),
        );
        saveActiveRel({
          relId: response.data.data.id,
          label: response.data.data.woman_name,
          image: response.data.data.woman_image,
          mobile: response.data.data.woman.mobile,
          birthday: response.data.data.woman.birth_date,
        });
        setSnackbar({
          msg: 'این رابطه به عنوان رابطه فعال شما ثبت شد.',
          visible: true,
          type: 'success',
        });
      } else {
        setResetPicker(!resetPicker);
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const onSelectSpouse = spouse => {
    if (spouse === 'newRel') {
      setResetPicker(!resetPicker);
      return navigation.navigate('AddRel', {
        handleUpdateRels: getAndHandleRels,
        showSnackbar: setSnackbar,
      });
    }
    setActiveSpouse(spouse);
  };
  const handlePusherInit = async () => {
    initPusher(pusher.data.pusher_user_id, pusher.data.token);
  };

  useEffect(() => {
    setSetts();
    setLoginManInfo();
    setPusher();
  }, []);

  useEffect(() => {
    if (pusher.data) {
      handlePusherInit();
    }
  }, [pusher]);

  useEffect(() => {
    if (activeRel) {
      getCalendar(activeRel.relId);
      getPregnancyPercent(activeRel.relId);
    }
  }, [activeRel]);

  useEffect(() => {
    if (setts.data && setts.data.is_successful) {
      const result = setts.data.data.find(
        e => e.key === 'app_text_need_support',
      );
      result && setAdsSetting(result);
      const settingsObj = setts.data.data.reduce(
        (acc, cur) => ({ ...acc, [cur.key]: cur }),
        {},
      );
      saveSettings(settingsObj);
      saveAllSettings(setts.data.data);
    }
  }, [setts]);

  useEffect(() => {
    if (params.refresh === 'true') {
      setLoginManInfo();
    }
  }, [params]);

  useEffect(() => {
    if (loginManInfo.data && loginManInfo.data.is_successful) {
      saveFullInfo(loginManInfo.data.data);
    }
  }, [loginManInfo]);

  useEffect(() => {
    getAndHandleRels();
  }, []);

  if (fetchingRels) {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header
          navigation={navigation}
          style={{ alignSelf: 'center', marginTop: STATUS_BAR_HEIGHT + rh(2) }}
          setShowLovePopup={setShowLove}
          setSnackbar={setSnackbar}
          ads={adsSettings && adsSettings.value}
        />

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      </BackgroundView>
    );
  }
  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ alignSelf: 'center', marginTop: STATUS_BAR_HEIGHT + rh(2) }}
        setShowLovePopup={setShowLove}
        setSnackbar={setSnackbar}
        ads={adsSettings && adsSettings.value}
      />

      <View style={styles.content}>
        {relations.length && !activeRel ? (
          <View style={styles.noRel}>
            <Text color={COLORS.red}>رابطه فعال خود را انتخاب کنید</Text>
            <Picker
              data={relations}
              onItemSelect={onSelectSpouse}
              reset={resetPicker}
              placeholder="انتخاب رابطه"
            />
          </View>
        ) : null}

        {relations.length && activeRel && pregnancy ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            <Pregnancy pregnancy={pregnancy} />
            <Image
              source={
                isPeriodDay
                  ? require('../../../assets/icons/home/period.png')
                  : require('../../../assets/icons/home/not-period.png')
              }
              style={{
                width: rw(28),
                height: rh(14),
                marginTop: rh(4),
              }}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
      {showLove ? (
        <ShowLovePopup handleVisible={() => setShowLove(false)} />
      ) : null}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  noRel: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

export default HomeScreen;
