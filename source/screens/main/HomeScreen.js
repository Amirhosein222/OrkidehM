/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import { View, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormData from 'form-data';

import { initPusher } from '../../libs/helpers';
import getManClient from '../../libs/api/manApi';
import {
  getSettings,
  getWomanInfo,
  getPusherUserId,
} from '../../libs/apiCalls';
import { useIsPeriodDay, useApi } from '../../libs/hooks';
import {
  saveWomanRelations,
  WomanInfoContext,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';
import getLoginClient from '../../libs/api/loginClientApi';
import {
  getFromAsyncStorage,
  showSnackbar,
  numberConverter,
} from '../../libs/helpers';

import {
  BackgroundView,
  Text,
  Image,
  Header,
  Snackbar,
  NoRelation,
  Picker,
} from '../../components/common';

import { COLORS, STATUS_BAR_HEIGHT, rw, rh } from '../../configs';

const HomeScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const isPeriodDay = useIsPeriodDay();
  const {
    saveFullInfo,
    fullInfo,
    handleUserPeriodDays,
    handleUserCalendar,
    settings,
    saveSettings,
  } = useContext(WomanInfoContext);
  const [setts, setSetts] = useApi(() => getSettings(''));
  const [pusher, setPusher] = useApi(() => getPusherUserId(''));

  const [adsSettings, setAdsSetting] = useState(
    settings ? settings.app_text_ads : null,
  );
  const [loginWomanInfo, setLoginWomanInfo] = useApi(() => getWomanInfo());
  const [pregnancy, setPregnancy] = useState(null);
  const [loadingPregnancy, setLoadingPregnancy] = useState(false);
  const [relations, setRelations] = useState([]);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [fetching, setFetching] = useState(true);
  const [resetPicker, setResetPicker] = useState(false);
  const womanInfo = useContext(WomanInfoContext);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const getPregnancyPercent = async function (relation) {
    // setPregnancy(null);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'man');
    formData.append('relation_id', relation);
    loginClient.post('formula/pregnancy', formData).then((response) => {
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
    manClient.post('show/calendar', formData).then((res) => {
      if (res.data.is_successful) {
        const periodDays = res.data.data.filter((d) => d.type === 'period');
        handleUserCalendar(res.data.data);
        handleUserPeriodDays(periodDays);
      } else {
        showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
      }
    });
  };

  const getRelations = async function () {
    const lastActiveRel = await AsyncStorage.getItem('lastActiveRelId');
    const loginClient = await getLoginClient();
    loginClient
      .get('index/relation?include_man=1&include_woman=1&gender=man')
      .then((response) => {
        setFetching(false);
        let rels = [];
        let activeRel = null;
        if (response.data.is_successful) {
          if (!response.data.data.length) {
            return;
          }
          response.data.data.map((rel) => {
            rels.push({
              label: rel.woman_name ? rel.woman_name : 'بدون نام',
              value: rel.id,
              is_active: rel.is_active,
              is_verified: rel.is_verified,
            });
            if (rel.is_active === 1 && rel.id === Number(lastActiveRel)) {
              activeRel = rel;
            }
          });
          if (activeRel) {
            saveActiveRel({
              relId: activeRel.id,
              label: activeRel.woman_name,
              image: activeRel.woman_image,
              mobile: activeRel.woman.mobile,
              birthday: activeRel.woman.birth_date,
            });
          }
          AsyncStorage.setItem('rels', JSON.stringify(rels));
          saveWomanRelations(rels);
        } else {
          showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
        }
      });
  };

  const setActiveSpouse = async function (value) {
    if (typeof value === 'object') {
      return true;
    }
    resetPicker && setResetPicker(false);
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', value);
    formData.append('gender', 'man');
    loginClient.post('active/relation', formData).then((response) => {
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
        setResetPicker(true);
        setSnackbar({
          msg: response.data.message,
          visible: true,
        });
      }
    });
  };

  const onSelectSpouse = (spouse) => {
    setActiveSpouse(spouse);
  };

  const handlePusherInit = () => {
    getFromAsyncStorage('pusherUid')
      .then(async (res) => {
        if (!res) {
          initPusher(pusher.data.pusher_user_id, pusher.data.token);
          await AsyncStorage.setItem('pusherUid', pusher.data.pusher_user_id);
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getRelations();
  }, []);

  useEffect(() => {
    !settings && setSetts();
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        saveFullInfo(JSON.parse(res));
      }
    });
    setPusher();
  }, []);

  useEffect(() => {
    if (pusher.data && fullInfo) {
      // Set user token
      handlePusherInit();
    }
  }, [pusher]);

  useEffect(() => {
    if (womanInfo.activeRel) {
      setRelations(true);
      getCalendar(womanInfo.activeRel.relId);
      getPregnancyPercent(womanInfo.activeRel.relId);
    }
  }, [womanInfo.activeRel]);

  useEffect(() => {
    if (setts.data && setts.data.is_successful) {
      const result = setts.data.data.find((e) => e.key === 'app_text_ads');
      result && setAdsSetting(result);
      const settingsObj = setts.data.data.reduce(
        (acc, cur) => ({ ...acc, [cur.key]: cur }),
        {},
      );
      saveSettings(settingsObj);
    }
  }, [setts]);

  useEffect(() => {
    if (params.refresh === 'true') {
      setLoginWomanInfo();
    }
  }, [params]);

  useEffect(() => {
    if (loginWomanInfo.data && loginWomanInfo.data.is_successful) {
      saveFullInfo(loginWomanInfo.data.data[0]);
      AsyncStorage.setItem(
        'fullInfo',
        JSON.stringify(loginWomanInfo.data.data[0]),
      );
    }
  }, [loginWomanInfo]);

  return (
    <BackgroundView>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2) }}
      />

      <View style={styles.content}>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              marginTop: rh(1),
              paddingHorizontal: rw(6),
            }}>
            <Text
              marginBottom={rh(1.5)}
              textAlign="right"
              color={COLORS.textLight}>
              {/* {adsSettings && adsSettings.value} */}
              متن تست تبلیغات متن تست تبلیغات
            </Text>
          </View>
        </View>

        {!fetching && !womanInfo.relations.length ? <NoRelation /> : null}
        {fetching ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          />
        ) : null}
        {womanInfo.relations.length && !womanInfo.activeRel ? (
          <View style={styles.noRel}>
            <Text color={COLORS.red}>رابطه فعال خود را انتخاب کنید</Text>
            <Picker
              data={womanInfo.relations}
              onItemSelect={onSelectSpouse}
              reset={resetPicker}
              placeholder="انتخاب رابطه"
            />
          </View>
        ) : null}

        {womanInfo.relations.length && womanInfo.activeRel && pregnancy ? (
          <>
            <View style={styles.pregnancyContainer}>
              <Image
                imageSource={require('../../assets/images/500.png')}
                width={rw(90)}
                height={rh(46)}
              />
              <View style={styles.pregnancyPercentText}>
                <Text bold xl color={COLORS.white}>
                  {pregnancy && numberConverter(pregnancy)}
                </Text>
                <Text large color={COLORS.white}>
                  احتمال بارداری
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: rh(4) }}>
              <Image
                imageSource={
                  isPeriodDay
                    ? require('../../assets/icons/home/period.png')
                    : require('../../assets/icons/home/not-period.png')
                }
                width="95px"
                height="70px"
              />
            </View>
          </>
        ) : null}

        {womanInfo.relations.length && womanInfo.activeRel && !pregnancy ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          />
        ) : null}
      </View>

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
    </BackgroundView>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  pregnancyContainer: {
    height: '55%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRel: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  pickerHeartContainer: {
    width: rw(95),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  pregnancyPercentText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: rh(5),
  },
  selectedDate: {
    fontFamily: 'Qs_Iranyekan_bold',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  unselectedDate: {
    fontFamily: 'Qs_Iranyekan_bold',
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.textLight,
  },
});

export default HomeScreen;
