const errorResponse = require('./error-handling');
const photo = require('./photo');
const validator = require('./validator');
const webToken = require('./web-token');
const authTelegram = require('./telegram-authorization');
const cookies = require('./cookies');

module.exports = {
  errorResponse,
  photo,
  validator,
  webToken,
  authTelegram,
  cookies,
};
