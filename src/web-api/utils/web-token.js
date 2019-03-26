const crypto = require('crypto');
const { WEB_TOKEN_KEY, WEB_AUTH_MAX_AUTH_PERIOD } = require('../../config');

const algorithm = 'aes-256-cbc';

const ivSize = 16; // aes-256 = 256b = 16B
const idMaxLength = 64; // 18 - Telegram's max

function getKeyHash() {
  const hash = crypto.createHash('sha256');
  hash.update(WEB_TOKEN_KEY.toString());
  return hash.digest();
}

function encrypt(decryptedToken) {
  const iv = crypto.randomBytes(ivSize);

  const cipher = crypto.createCipheriv(algorithm, getKeyHash(), iv);
  const dataBuf = cipher.update(decryptedToken, 'utf8');
  const finalBuf = cipher.final();

  const encrypted = Buffer.concat([dataBuf, finalBuf, iv]);
  return encrypted.toString('base64');
}

function decrypt(encryptedToken) {
  const encrypted = Buffer.from(encryptedToken, 'base64');

  const iv = encrypted.slice(encrypted.length - ivSize);
  const encryptedData = encrypted.slice(0, encrypted.length - ivSize);

  const decipher = crypto.createDecipheriv(algorithm, getKeyHash(), iv);
  return decipher.update(encryptedData, 'utf8') + decipher.final('utf8');
}

function packToken({ id, date }) {
  return JSON.stringify({ id, date: date.getTime() });
}

function unpackToken(packedToken) {
  const token = JSON.parse(packedToken);
  token.date = new Date(token.date); // ms to Date object
  return token;
}

function create(id, date = new Date()) {
  if (typeof id !== 'string') {
    throw new TypeError('WEB-token: ID must be a string!');
  }
  if (id.length > idMaxLength) {
    throw new Error(`WEB-token: ID is too long! Max: ${idMaxLength} characters`);
  }

  const packedToken = packToken({ id, date });
  const encryptedToken = encrypt(packedToken);
  return encodeURIComponent(encryptedToken);
}

function isDateExpired({ date }) {
  const age = Date.now() - date.getTime();

  if (age > WEB_AUTH_MAX_AUTH_PERIOD) return true;

  return false;
}

function getUserCredentials(encodedToken) {
  const encryptedToken = decodeURIComponent(encodedToken);
  const packedToken = decrypt(encryptedToken);
  const token = unpackToken(packedToken);

  if (isDateExpired(token)) throw new Error('WEB-token: token expired!');

  return token;
}

function isExpired(encryptedToken) {
  const packedToken = decrypt(encryptedToken);
  const token = unpackToken(packedToken);
  return isDateExpired(token);
}

module.exports = {
  create,
  getUserCredentials,
  isExpired,
};
