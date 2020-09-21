const getTimestampFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const dayStr = getDatePiece(date.getDate());
  const hours = date.getHours();
  const minutesStr = getDatePiece(date.getMinutes());
  const secondsStr = getDatePiece(date.getSeconds());
  return `${year}-${monthStr}-${dayStr} ${hours}:${minutesStr}:${secondsStr}`;
};

const getDatePiece = (piece)=> {
  return piece < 10 ? `0${piece}` : `${piece}`;
};

module.exports = getTimestampFormattedDate;
