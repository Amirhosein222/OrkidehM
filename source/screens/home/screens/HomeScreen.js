/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormData from 'form-data';
import { CommonActions } from '@react-navigation/native';

import { getPartnerSympsApi } from '../apis';
import { initPusher } from '../../../libs/helpers';
import getManClient from '../../../libs/api/manApi';
import {
  getSettings,
  getManInfo,
  getPusherUserId,
} from '../../../libs/apiCalls';
import { useApi } from '../../../libs/hooks';
import {
  WomanInfoContext,
  saveActiveRel,
} from '../../../libs/context/womanInfoContext';
import getLoginClient from '../../../libs/api/loginClientApi';

import {
  BackgroundView,
  Text,
  Header,
  Snackbar,
  Picker,
  ShowLovePopup,
} from '../../../components/common';

import { COLORS, STATUS_BAR_HEIGHT, rh, rw } from '../../../configs';
import Pregnancy from '../components/Pregnancy/Pregnancy';
import PartnerSympSection from '../components/partnerSympSection';
import PartnerCalendar from '../components/partnerCalendar';
import Slider from '../components/slider';
import { ScrollView } from 'react-native-gesture-handler';
import { ExpSympInfoModal } from '../../expSym/components';

const HomeScreen = ({ navigation, route }) => {
  const params = route.params || {};
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
    userCalendar,
    isPeriodDay,
    allSettings,
  } = useContext(WomanInfoContext);
  const [setts, setSetts] = useApi(() => getSettings(''));
  const [pusher, setPusher] = useApi(() => getPusherUserId(''));
  const selectedSymp = useRef(null);
  const [adsSettings, setAdsSetting] = useState(
    settings ? settings.app_text_need_support : null,
  );
  const [loginManInfo, setLoginManInfo] = useApi(() => getManInfo());
  const [partnerSymps, setPartnerSymps] = useApi(() =>
    getPartnerSympsApi(activeRel.relId),
  );

  const [pregnancy, setPregnancy] = useState(null);
  const [snackbar, setSnackbar] = useState({ msg: '', visible: false });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [resetPicker, setResetPicker] = useState(false);
  const [showLove, setShowLove] = useState(false);

  const handleVisible = () => {
    setSnackbar({
      visible: !snackbar.visible,
    });
  };

  const getPregnancyPercent = async function (relation) {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'man');
    formData.append('relation_id', relation);
    loginClient.post('formula/pregnancy', formData).then(response => {
      if (response.data.is_successful) {
        setPregnancy(response.data.data);
      } else {
        setSnackbar({
          msg: JSON.stringify(response.data.message),
          visible: true,
        });
      }
    });
  };

  const getCalendar = async function (relation) {
    const manClient = await getManClient();
    manClient.post(`show/calendar?relation_id=${relation}`).then(res => {
      if (res.data.is_successful) {
        const periodDays = res.data.data.filter(d => d.type === 'period');
        handleUserCalendar(res.data.data);
        handleUserPeriodDays(periodDays);
      } else {
        setSnackbar({
          msg: 'خطایی رخ داده است، مجدد تلاش کنید',
          visible: true,
        });
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

  const openInfoModal = symp => {
    selectedSymp.current = symp;
    setShowInfoModal(true);
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
      getPregnancyPercent(activeRel.relId);
      setPartnerSymps();
      getCalendar(activeRel.relId);
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
      if (
        !loginManInfo.data.data.name &&
        allSettings &&
        !getCalendar.isFetching
      ) {
        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'EnterInfo',
                params: { unCompleteRegister: true },
              },
            ],
          }),
        );
      }
      saveFullInfo(loginManInfo.data.data);
    }
  }, [loginManInfo, allSettings, getCalendar]);

  useEffect(() => {
    getAndHandleRels();
  }, []);

  if (fetchingRels || !relations.length || partnerSymps.isFetching) {
    return (
      <BackgroundView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header
          navigation={navigation}
          style={{ alignSelf: 'center', marginTop: STATUS_BAR_HEIGHT + rh(1) }}
          setShowLovePopup={setShowLove}
          setSnackbar={setSnackbar}
          ads={adsSettings && adsSettings.value}
        />

        <ActivityIndicator
          size="large"
          color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
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
        style={{ alignSelf: 'center', marginTop: STATUS_BAR_HEIGHT }}
        setShowLovePopup={setShowLove}
        setSnackbar={setSnackbar}
      />

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={styles.content}>
        <View
          style={{
            height: rh(22),
            alignItems: 'center',
          }}>
          {allSettings ? (
            <Slider />
          ) : (
            <View
              style={{
                width: rw(82.5),
                height: rh(16.2),
                backgroundColor: 'rgba(100,100,100, 0.2)',
                borderRadius: 18,
                marginTop: rh(2),
              }}
            />
          )}
        </View>
        {!activeRel ? (
          <View style={styles.noRel}>
            <Text color={COLORS.red}>رابطه فعال خود را انتخاب کنید</Text>
            <Picker
              data={relations}
              onItemSelect={onSelectSpouse}
              reset={resetPicker}
              placeholder="انتخاب رابطه"
            />
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
            }}>
            {pregnancy ? <Pregnancy pregnancy={pregnancy} /> : null}
            {partnerSymps.data && partnerSymps.data.data.signs.length ? (
              <PartnerSympSection
                onReadMore={openInfoModal}
                symps={partnerSymps.data.data.signs}
                refresh={setPartnerSymps}
              />
            ) : (
              <View style={{ width: '92%', marginVertical: rh(2) }}>
                <Text size={11} bold alignSelf="flex-end">
                  علائم امروز {activeRel.label} :
                </Text>
                <Text size={10} alignSelf="center" marginTop={rh(2)}>
                  {activeRel.label} امروز چیزی رو ثبت نکرده!
                </Text>
              </View>
            )}
            {userCalendar ? <PartnerCalendar /> : null}
          </View>
        )}
      </ScrollView>

      {selectedSymp.current && (
        <ExpSympInfoModal
          visible={showInfoModal}
          closeModal={() => setShowInfoModal(false)}
          item={selectedSymp.current}
        />
      )}
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
    justifyContent: 'flex-start',
    alignSelf: 'center',
    flexGrow: 1,
  },
  noRel: {
    width: '100%',
    marginTop: rh(8),
  },
});

export default HomeScreen;
