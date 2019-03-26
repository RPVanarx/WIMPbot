const { createHash, createHmac } = require('crypto');
const { TELEGRAM_TOKEN, WEB_AUTH_MAX_AUTH_PERIOD } = require('../../config');

const SHA_256_HASH_LENGTH = 64;

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
// TODO: validate authentication date
function validateAuthDate({ auth_date: dateInSeconds }) {
  const date = new Date(0);
  date.setSeconds(dateInSeconds);

  if (Date.now() - date > WEB_AUTH_MAX_AUTH_PERIOD) throw new Error('Authentication expired');
}

module.exports = function authorize(telegramAuthData) {
  validatePayload(telegramAuthData);
  checkSignature(telegramAuthData);
  // validateAuthDate(telegramAuthData);

  return telegramAuthData;
};

// Sample

// // Response sample with date Feb 23 2018 18:33:20 GMT+0200
// const payload = {
//   id: '424242424242',
//   first_name: 'John',
//   last_name: 'Doe',
//   username: 'username',
//   photo_url: 'https://t.me/i/userpic/320/username.jpg',
//   auth_date: '1519400000',
//   hash: '2e1c00320c36f60782c8dda335a6b747c152a15d7d734636a6471256bbd982ed',
// };

// async function as() {
//   try {
//     console.log(module.exports(payload));
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// as();
