import getManClient from '../../../libs/api/manApi';

// export const updateCalendar = async function (relId) {
//   const womanClient = await getWomanClient();
//   try {
//     const res = await womanClient.get(
//       `https://orkidehapp.ir/api/man/show/calendar?relation_id=${relId}`,
//     );
//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const updateCalendarApi = async function (dates) {
  console.log('dates for api ', dates);
  const formattedDataForApi = {
    dates: dates,
  };
  const manClient = await getManClient();
  try {
    const res = await manClient.put(
      'https://orkidehapp.ir/api/man/update/calendar',
      formattedDataForApi,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCalendarApi = async function (relId) {
  const manClient = await getManClient();
  try {
    const res = await manClient.post(
      `https://orkidehapp.ir/api/man/show/calendar?relation_id=${relId}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
