const { createHash, createHmac } = require('crypto');

const {
  credentials: { TELEGRAM_TOKEN },
  webApi: { WEB_AUTH_AGE, SHA_256_HASH_LENGTH },
} = require('../../config');

function validatePayload(data) {
  if (!data) throw new TypeError('Empty data!');

  const { hash, ...rest } = data;

  if (!hash || !hash.length || hash.length !== SHA_256_HASH_LENGTH) {
    throw new Error('Invalid hash property!');
  }

  if (!Object.keys(rest).length) throw new TypeError('Invalid data!');
}

// Data-check-string is a concatenation of all received fields, sorted in
// alphabetical order, in the format key=<value> with a line feed character
// ('\n', 0xA0) used as separator
function buildDataCheckString(data) {
  return Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
}

function checkSignature({ hash, ...data }) {
  const checkString = buildDataCheckString(data);

  const tokenDigest = createHash('sha256')
    .update(TELEGRAM_TOKEN)
    .digest();

  const hmac = createHmac('sha256', tokenDigest)
    .update(checkString)
    .digest('hex');

  if (hmac !== hash) throw new Error('Invalid data signature');
}

function validateAuthDate({ auth_date: dateInSeconds }) {
  const date = new Date(0);
  date.setSeconds(dateInSeconds);

  if (WEB_AUTH_AGE < Date.now() - date) throw new Error('Authentication expired');
}

module.exports = function auth(telegramAuthData) {
  validatePayload(telegramAuthData);
  checkSignature(telegramAuthData);
  validateAuthDate(telegramAuthData);

  return telegramAuthData;
};
