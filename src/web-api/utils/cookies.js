const { WEB_AUTH_MAX_AUTH_PERIOD } = require('../../config');

const FIELD_TOKEN = 'token';

function setToken(ctx, token, overwrite = false) {
  ctx.cookies.set(FIELD_TOKEN, token, { maxAge: WEB_AUTH_MAX_AUTH_PERIOD, overwrite });
}

function getToken(ctx) {
  return ctx.cookies.get(FIELD_TOKEN);
}

module.exports = {
  setToken,
  getToken,
};
