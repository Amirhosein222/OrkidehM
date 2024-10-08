import getLoginClient from '../../../libs/api/loginClientApi';

export const getRelsApi = async function () {
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

export const addRelApi = async function (mobile, pic, name) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('woman_mobile', mobile);
    pic &&
      formData.append('woman_image', {
        uri: pic,
        name: 'spouseImg.png',
        type: 'image/png',
      });
    formData.append('woman_name', name);
    formData.append('gender', 'man');
    const res = await loginClient.post('store/relation', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};

export const updateRelApi = async function (id, name, mobile, pic) {
  try {
    const loginClient = await getLoginClient();
    const formData = new FormData();
    formData.append('relation_id', id);
    formData.append('gender', 'man');
    formData.append('woman_name', name);
    formData.append('woman_mobile', mobile);
    pic &&
      formData.append('woman_image', {
        uri: pic,
        name: 'spouseImg.png',
        type: 'image/png',
      });
    const res = await loginClient.post('update/relation', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
