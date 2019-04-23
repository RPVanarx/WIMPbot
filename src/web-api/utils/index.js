const validator = require('./validator');
const webToken = require('./web-token');
const authTelegram = require('./telegram-authorization');
const parser = require('./multipart-parser');

module.exports = {
  validator,
  webToken,
  authTelegram,
  parser,
};
