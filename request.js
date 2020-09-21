const http = require('http');
const iconv = require('iconv-lite');

const makeGetRequest = async (url, queryParams = {}, options = {}) => {
  return new Promise((resolve, reject) => {
    http.get("http://www.cbr.ru/scripts/XML_daily.asp?fbclid=IwAR0pWiw44CsS6rYRWaW1-qkKLNa2HXCtVezZ2hdEKEskCuJyLZfUumPewxg", (res) => {
      res.pipe(iconv.decodeStream("win1251")).collect((err, body) => {
        resolve(body);
      });
    }).end()
  });
};

module.exports = makeGetRequest;
