import getManClient from '../../../libs/api/manApi';
import getLoginClient from '../../../libs/api/loginClientApi';
import moment from 'jalali-moment';

export const getCalendarApi = async function () {
  try {
    const manClient = await getManClient();
    const res = await manClient.get('show/calendar');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getPregnancyPercentApi = async function (activeRel) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('gender', 'man');
    formData.append('relation_id', activeRel);
    const res = await loginClient.post('formula/pregnancy', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const storePeriodAutoApi = async function (date) {
  try {
    const manClient = await getManClient();
    const formData = new FormData();
    formData.append('date', date);
    const res = await manClient.post('store/period/auto', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getRelationsApi = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      'index/relation?include_man=1&include_woman=1&gender=man',
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const getPartnerSympsApi = async function (activeRel) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', activeRel);
    formData.append('gender', 'man');
    formData.append(
      'date',
      moment(new Date(), 'YYYY/MM/DD').locale('en').format('jYYYY/jMM/jDD'),
    );
    formData.append('include_sign', 1);
    const res = await loginClient.post(
      'show/spouse/moods/and/expectation',
      formData,
    );
    console.log('partnerSymp res ', res.data);
    return res.data;
  } catch (error) {
    console.log('e at partnersymp ', error.response);
    throw error;
  }
};
