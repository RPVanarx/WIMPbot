const { WEB_AUTH_AGE } = require('../../config');

const FIELD_TOKEN = 'token';

function setToken(ctx, token, overwrite = false) {
  const maxAge = Number(WEB_AUTH_AGE);
  if (Number.isNaN(maxAge)) {
    throw new TypeError('WEB_AUTH_AGE must be a number!');
  }

  ctx.cookies.set(FIELD_TOKEN, token, { maxAge, overwrite });
}

function getToken(ctx) {
  return ctx.cookies.get(FIELD_TOKEN);
}

module.exports = {
  setToken,
  getToken,
};
