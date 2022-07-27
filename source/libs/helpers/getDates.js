import moment from 'moment-jalaali';

const getDates = function () {
  const startOfWeek = moment().subtract(2, 'month').startOf('day');
  const endOfWeek = moment().endOf('day');

  let days = [];
  let day = startOfWeek;

  while (day <= endOfWeek) {
    days.push(moment(day).locale('en').format('jYYYY/jMM/jDD'));
    day = day.clone().add(1, 'd');
  }
  return days;
};

export default getDates;
