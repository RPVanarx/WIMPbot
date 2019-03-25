const crypto = require('crypto');
const { WEB_TOKEN_KEY } = require('../../config');

const algorithm = 'aes-256-cbc';

const ivSize = 16; // aes-256 = 256b = 16B
const idMaxLength = 64; // 18 - Telegram's max

function getKey() {
  const hash = crypto.createHash('sha256');
  hash.update(WEB_TOKEN_KEY.toString());
  return hash.digest();
}

function encrypt(decryptedToken) {
  const iv = crypto.randomBytes(ivSize);

  const cipher = crypto.createCipheriv(algorithm, getKey(), iv);
  const dataBuf = cipher.update(decryptedToken, 'utf8');
  const finalBuf = cipher.final();

  const encrypted = Buffer.concat([dataBuf, finalBuf, iv]);
  return encrypted.toString('base64');
}

function decrypt(encryptedToken) {
  const encrypted = Buffer.from(encryptedToken, 'base64');

  const iv = encrypted.slice(encrypted.length - ivSize);
  const encryptedData = encrypted.slice(0, encrypted.length - ivSize);

  const decipher = crypto.createDecipheriv(algorithm, getKey(), iv);
  return decipher.update(encryptedData, 'utf8') + decipher.final('utf8');
}

function createToken({ id, date }) {
  if (typeof id !== 'string') {
    throw new TypeError('WEB-token: ID must be a string!');
  }
  if (id.length > idMaxLength) {
    throw new Error(`WEB-token: ID is too long! Max: ${idMaxLength} characters`);
  }

  const decryptedToken = JSON.stringify({ id, date });
  return encrypt(decryptedToken);
}

function getUserCredentials(webToken) {
  const decryptedToken = decrypt(webToken);
  const token = JSON.parse(decryptedToken);
  return token;
}

module.exports = {
  getUserCredentials,
  createToken,
};
