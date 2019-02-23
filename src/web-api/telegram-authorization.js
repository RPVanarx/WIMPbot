const { createHash, createHmac } = require('crypto');
const { TOKEN: TELEGRAM_TOKEN } = require('../config');

const WEB_AUTH_TELEGRAM_MAX_HASH_LENGTH = 64;
const WEB_AUTH_MAX_AUTH_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in millisecs

function validatePayload(data) {
  if (!data) throw new TypeError('Empty payload or invalid payload type');

  if (!data.hash || !data.hash.length || data.hash.length > WEB_AUTH_TELEGRAM_MAX_HASH_LENGTH) {
    throw new Error('Invalid hash property');
  }
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

  if (Date.now() - date > WEB_AUTH_MAX_AUTH_PERIOD) throw new Error('Authentication expired');
}

module.exports = function authorize(data) {
  try {
    validatePayload(data);
    checkSignature(data);
    validateAuthDate(data);
  } catch (err) {
    throw new Error(`Authorization failed: ${err.message}`);
  }
  return data;
};

// Sample usage

// Response sample with date Feb 23 2018 18:33:20 GMT+0200
const payload = {
  id: '424242424242',
  first_name: 'John',
  last_name: 'Doe',
  username: 'username',
  photo_url: 'https://t.me/i/userpic/320/username.jpg',
  auth_date: '1519400000',
  hash: 'fd99f6545c6bda17b8d85ce11d3393dbbf12713f338f420673c9bf4fd4256cc7',
};

async function as() {
  try {
    console.log(module.exports(payload));
  } catch (err) {
    console.log(err.message);
  }
}

as();
