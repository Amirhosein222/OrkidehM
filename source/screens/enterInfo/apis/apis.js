import getManClient from '../../../libs/api/manApi';

export const sendInfoApi = async function (
  lastPeriodDate,
  periodLength,
  cycleLength,
) {
  try {
    const manClient = await getManClient();
    const formData = new FormData();
    formData.append('last_period_date', lastPeriodDate);
    formData.append('period_length', periodLength);
    formData.append('cycle_length', cycleLength);
    const res = await manClient.post('store/period_info', formData);
    return res.data;
  } catch (error) {
    // console.log('e ', error.response);
    throw error;
  }
};
