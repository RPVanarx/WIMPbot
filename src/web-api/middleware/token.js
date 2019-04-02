const webToken = require('../utils/web-token');

const { WEB_AUTH_AGE } = require('../../config');

const FIELD_TOKEN = 'token';

function set() {
  const maxAge = Number(WEB_AUTH_AGE);
  if (Number.isNaN(maxAge)) throw new TypeError('WEB_AUTH_AGE must be a number!');

  return async (ctx, next) => {
    ctx.assert(ctx.token && ctx.token.id, 500, 'Token set error!');

    const encryptedToken = webToken.create(ctx.token.id);

    ctx.cookies.set(FIELD_TOKEN, encryptedToken, { maxAge, overwrite: true });

    ctx.token = { ...ctx.token, token: encryptedToken };
    await next();
  };
}

function get() {
  let decryptedToken;

  return async (ctx, next) => {
    const encryptedToken = ctx.cookies.get(FIELD_TOKEN);
    try {
      decryptedToken = webToken.getUserCredentials(encryptedToken);
    } catch (err) {
      ctx.throw(401, 'Invalid token!', { error: err });
    }

    ctx.token = { id: decryptedToken.id, token: encryptedToken };
    await next();
  };
}

module.exports = {
  set,
  get,
};
