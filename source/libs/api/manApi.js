import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAccessToken = async () => {
  try {
    const retrievedToken = await AsyncStorage.getItem('userToken');
    if (retrievedToken !== null) {
      const token = JSON.parse(retrievedToken);
      const authorization = `Bearer ${token}`;
      // We have data!!
      return authorization;
    }
    return null;
  } catch (error) {
    // Error retrieving data
  }
};

const manApi = axios.create({
  baseURL: 'https://orkidehapp.ir/api/man/',
  headers: {
    Accept: 'application/json',
  },
});
manApi.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const getManClient = async () => {
  manApi.defaults.headers.common.Authorization = await getAccessToken();
  return manApi;
};

// Intercept all request
// manApi.interceptors.request.use(
//   (config) => {
//     console.log('configs: ', config);
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// Intercept all responses
manApi.interceptors.response.use(
  async response => {
    if (response.status === 401) {
      try {
        const value = await AsyncStorage.getItem('userToken');
        if (value !== null) {
          // We have data!!
          AsyncStorage.clear();
        }
      } catch (error) {
        // Error retrieving data
        console.log(error, 'logged in client error');
      }
    }
    return response;
  },
  error => {
    console.error(error);
    return Promise.reject(error);
  },
);
export default getManClient;
