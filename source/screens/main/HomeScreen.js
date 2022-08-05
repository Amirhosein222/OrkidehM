/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarList } from 'react-native-calendars-persian';
import moment from 'moment-jalaali';
import FormData from 'form-data';

import Picker from '../../components/common/Picker';

import getManClient from '../../libs/api/manApi';
import getLoginClient from '../../libs/api/loginClientApi';

import {
  saveWomanRelations,
  WomanInfoContext,
  saveActiveRel,
} from '../../libs/context/womanInfoContext';

import { getFromAsyncStorage, showSnackbar } from '../../libs/helpers';

import {
  Container,
  Divider,
  Text,
  Header,
  Snackbar,
  NoRelation,
} from '../../components/common';

import { CalendarInfo } from '../../components/informations';

import { COLORS, rh, rw, STATUS_BAR_HEIGHT } from '../../configs';
import { useApi, useIsPeriodDay } from '../../libs/hooks';
import { getSettings } from '../../libs/apiCalls';

const CALENDAR_THEME = {
  calendarBackground: '#ffffff',
  textSectionTitleColor: COLORS.blue,
  selectedDayBackgroundColor: '#00adf5',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00adf5',
  selectedDotColor: '#ffffff',
  arrowColor: COLORS.blue,
  monthTextColor: COLORS.blue,
  textDayFontFamily: 'Vazir',
  textMonthFontFamily: 'Vazir',
  textDayHeaderFontFamily: 'Vazir',
  textDayFontSize: 14,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 10,
};

const HomeScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const isPeriodDay = useIsPeriodDay();
  const {
    saveFullInfo,
    handleUserPeriodDays,
    handleUserCalendar,
    settings,
    saveSettings,
  } = useContext(WomanInfoContext);
  const [setts, setSetts] = useApi(() => getSettings(''));
  const [adsSettings, setAdsSetting] = useState(
    settings ? settings.app_text_ads : null,
  );
  const [pregnancy, setPregnancy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relations, setRelations] = useState([]);
  const [currentMarkedDates, setCurrentMarkedDates] = useState([]);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [resetPicker, setResetPicker] = useState(false);
  const [fetchCalendar, setFetchCalendar] = useState(false);
  const womanInfo = useContext(WomanInfoContext);

  const getRelations = async function () {
    const lastActiveRel = await AsyncStorage.getItem('lastActiveRelId');
    const loginClient = await getLoginClient();
    loginClient
      .get('index/relation?include_man=1&include_woman=1&gender=man')
      .then((response) => {
        setIsLoading(false);
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

  const getPregnancyPercent = async function (relation) {
    setPregnancy(null);
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

  // convert current dates from calendar api, then render on Calendar
  const handleCurrentMarkedDates = function (calendar) {
    const currentDates = {};
    calendar.map((item) => {
      const convertedDate = moment(item.date, 'X')
        .locale('en')
        .format('YYYY-MM-DD');

      currentDates[convertedDate] = {
        selected: true,
        marked: true,
        selectedColor:
          item.type === 'period'
            ? '#fe0294'
            : item.type === 'sex'
            ? COLORS.red
            : item.type === 'period_f'
            ? COLORS.orange
            : item.type === 'ovulation_f'
            ? COLORS.darkYellow
            : COLORS.darkRed,
        type: item.type,
      };
    });
    setCurrentMarkedDates(currentDates);
  };

  const getCalendar = async function (relation) {
    setFetchCalendar(true);
    const manClient = await getManClient();
    const formData = new FormData();
    formData.append('relation_id', relation);
    manClient.post('show/calendar', formData).then((res) => {
      setFetchCalendar(false);
      if (res.data.is_successful) {
        handleCurrentMarkedDates([...res.data.data]);
        const periodDays = res.data.data.filter((d) => d.type === 'period');
        handleUserPeriodDays(periodDays);
      } else {
        showSnackbar('متاسفانه مشکلی بوجود آمده است، مجددا تلاش کنید');
      }
    });
  };

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  useEffect(() => {
    !settings && setSetts();
    // getFromAsyncStorage('fcmTokenSent').then((res) => {
    //   if (!res) {
    //     sendFcmToken();
    //   }
    // });
    getFromAsyncStorage('fullInfo').then((res) => {
      if (res) {
        saveFullInfo(JSON.parse(res));
      }
    });
  }, []);

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
    getRelations();
  }, []);

  useEffect(() => {
    if (womanInfo.activeRel) {
      setRelations(true);
      getCalendar(womanInfo.activeRel.relId);
      getPregnancyPercent(womanInfo.activeRel.relId);
    }
  }, [womanInfo.activeRel]);

  return (
    <Container justifyContent="flex-start">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        navigation={navigation}
        style={{ marginTop: STATUS_BAR_HEIGHT + rh(2) }}
      />
      <Divider color={COLORS.lightBlue} width="80%" />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.rossoCorsa : COLORS.blue}
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
        />
      ) : (
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}>
          {womanInfo.relations.length && womanInfo.activeRel ? (
            <View style={{ flex: 1 }}>
              <View style={styles.pregnancyContainer}>
                <View style={{ margin: 5 }}>
                  <Image
                    source={require('../../assets/images/pa.png')}
                    style={styles.sympIcon}
                  />
                  <Image
                    source={require('../../assets/images/de.png')}
                    style={styles.sympIcon}
                  />
                </View>
                <View style={{ margin: 5 }}>
                  <Image
                    source={require('../../assets/images/de.png')}
                    style={styles.sympIcon}
                  />
                  <Image
                    source={require('../../assets/images/pa.png')}
                    style={styles.sympIcon}
                  />
                </View>

                <View>
                  <Image
                    source={
                      isPeriodDay
                        ? require('../../assets/images/600.png')
                        : require('../../assets/images/500.png')
                    }
                    style={styles.pregPercentIcon}
                  />

                  {pregnancy ? (
                    <View style={styles.pregnancyPercentText}>
                      <Text bold medium color={COLORS.white}>
                        {pregnancy}
                      </Text>
                      <Text color={COLORS.white}>احتمال بارداری</Text>
                    </View>
                  ) : (
                    <View style={styles.pregnancyPercentText}>
                      <ActivityIndicator size="large" color="white" />
                    </View>
                  )}
                </View>
              </View>

              {fetchCalendar === false ? (
                <View>
                  <CalendarList
                    jalali
                    markedDates={currentMarkedDates}
                    hideExtraDays={true}
                    disableMonthChange={false}
                    firstDay={6}
                    hideDayNames={false}
                    showWeekNumbers={false}
                    style={styles.calendar}
                    theme={{
                      ...CALENDAR_THEME,
                      monthTextColor: isPeriodDay
                        ? COLORS.rossoCorsa
                        : COLORS.blue,
                      textSectionTitleColor: isPeriodDay
                        ? COLORS.rossoCorsa
                        : COLORS.blue,
                    }}
                    markingType="simple"
                    horizontal={true}
                    pagingEnabled={false}
                    onDayPress={() => {}}
                  />
                  <CalendarInfo />
                </View>
              ) : (
                <ActivityIndicator
                  size="large"
                  color={isPeriodDay ? COLORS.rossoCorsa : COLORS.blue}
                  style={{ marginTop: 'auto', marginBottom: 'auto' }}
                />
              )}
            </View>
          ) : womanInfo.relations.length && womanInfo.fullInfo ? (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 'auto',
                marginBottom: 'auto',
              }}>
              <Picker
                data={womanInfo.relations}
                onItemSelect={onSelectSpouse}
                reset={resetPicker}
                placeholder={
                  womanInfo.activeRel
                    ? womanInfo.activeRel.label
                    : 'انتخاب رابطه'
                }
                listMode="SCROLLVIEW"
              />
            </View>
          ) : (
            <NoRelation navigation={navigation} />
          )}
        </ScrollView>
      )}

      {snackbar.visible === true ? (
        <Snackbar
          message={snackbar.msg}
          type={snackbar.type}
          handleVisible={handleVisible}
        />
      ) : null}
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
  pregnancyContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: rh(1),
    paddingHorizontal: rw(2),
  },
  pregPercentIcon: {
    width: rw(40),
    height: rh(22),
  },
  sympIcon: {
    width: 70,
    height: 70,
    marginTop: rh(0.8),
  },
  noRel: {
    width: '100%',
    marginTop: 50,
  },
  selectedLabel: {
    color: COLORS.white,
    fontFamily: 'Vazir',
    fontSize: 14,
  },
  btn: {
    width: '70%',
    height: 40,
    marginTop: 10,
    alignSelf: 'center',
  },
  pickerContainer: {
    height: 40,
    width: '60%',
    marginTop: 20,
    alignSelf: 'center',
  },
  pregnancyPercentText: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: rh(3),
  },
  calendar: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default HomeScreen;
