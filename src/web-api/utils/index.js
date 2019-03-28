const errorResponse = require('./error-handling');
const photo = require('./photo-url');
const validator = require('./validator');
const webToken = require('./web-token');
const authTelegram = require('./telegram-authorization');
const cookies = require('./cookies');
const parser = require('./multipart-parser');

module.exports = {
  errorResponse,
  photo,
  validator,
  webToken,
  authTelegram,
  cookies,
  parser,
};
