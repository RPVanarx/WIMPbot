const validator = require('./validator');

function getUserCredentials({ webToken }) {
  const errors = validator.webToken({ token: webToken });

  if (errors.length) throw new Error(errors.join(' '));

  const { userId, userName } = { userId: '1', userName: 'decryptor' };//decrypt(webToken) TODO: decrypt webToken
  return { userId, userName };
}

module.exports = {
  getUserCredentials,
};
