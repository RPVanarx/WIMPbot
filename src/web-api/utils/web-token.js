const crypto = require('crypto');

const {
  webApi: { TOKEN_KEY, AUTH_AGE },
} = require('../../config');

const algorithm = 'aes-256-cbc';

const ivSize = 16; // aes-256 = 256b = 16B

function getKeyHash() {
  const hash = crypto.createHash('sha256');

  if (!TOKEN_KEY) throw new Error('No token key!');
  hash.update(TOKEN_KEY.toString());
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

function packToken({ chest, date }) {
  return JSON.stringify({ chest, date: date.getTime() });
}

function unpackToken(packedToken) {
  const token = JSON.parse(packedToken);
  token.date = new Date(token.date); // ms to Date object
  return token;
}

function put(chest, date = new Date()) {
  const packedToken = packToken({ chest, date });
  return encrypt(packedToken);
}

function isDateExpired({ date }) {
  const age = Date.now() - date.getTime();

  if (age > AUTH_AGE) return true;

  return false;
}

function get(encryptedToken) {
  const packedToken = decrypt(encryptedToken);
  const token = unpackToken(packedToken);

  if (isDateExpired(token)) throw new Error('Token expired! Please sign in again.');

  return token.chest;
}

module.exports = {
  put,
  get,
};
