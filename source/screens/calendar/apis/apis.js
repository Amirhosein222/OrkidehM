import getManClient from '../../../libs/api/manApi';

export const getDaysGroupedWithCycles = async function () {
  const manClient = await getManClient();
  try {
    const res = await manClient.get(
      'https://orkidehapp.ir/api/woman/show/calendar/grouped_with_cycle',
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
