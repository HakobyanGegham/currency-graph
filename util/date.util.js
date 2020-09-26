const moment = require('moment');
const keys = ['years', 'quarters', 'months', 'weeks', 'days', 'hours', 'minutes',
  'seconds', 'milliseconds', 'y', 'Q', 'm', 'w', 'd', 'h', 'm', 's', 'ms'];

const getFormattedDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!moment(date).isValid()) {
    return false;
  }
  return moment(date).format(format);
};

const getSubstrDate = (date, duration, key) => {
  if (keys.indexOf(key) === -1) {
    return false;
  }
  if (!moment(date).isValid()) {
    return false;
  }
  return moment(date).subtract(duration, key);
};

const getAddDate = (date, duration, key) => {
  if (keys.indexOf(key) === -1) {
    return false;
  }
  if (!moment(date).isValid()) {
    return false;
  }
  return moment(date).subtract(duration, key);
};

const isBetween = (date, beforeDate, afterDate) => {
  if (!moment(date).isValid() || !moment(beforeDate).isValid() || !moment(afterDate).isValid()) {
    return false;
  }

  return moment(date).isBetween(beforeDate, afterDate);
};
module.exports = {getFormattedDate, getSubstrDate, getAddDate, isBetween};
