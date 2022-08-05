import axios from 'axios';
import { getAccessToken } from '../helpers';
import getLoginClient from '../api/loginClientApi';
import getManClient from '../api/manApi';

export const verifyRelation = async function (code) {
  try {
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('gender', 'man');
    formData.append('code', code);
    const res = await axios.post(
      'https://orkidehapp.ir/api/user/verify/relation',
      formData,
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const buyGoldenAccount = async function () {
  try {
    const loginClient = await getLoginClient();
    const res = await loginClient.get(
      'payment/buy/account_type_golden?gender=man',
    );
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const getSettings = async function (key) {
  try {
    const res = await axios.get('https://orkidehapp.ir/api/setting');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};

export const getManInfo = async function () {
  try {
    const manClient = await getManClient();
    const res = await manClient.get('login_man');
    return res.data;
  } catch (error) {
    // console.log('e ', error.response.status);
    throw error;
  }
};
