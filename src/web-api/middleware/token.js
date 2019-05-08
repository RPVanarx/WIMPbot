const webToken = require('../utils/web-token');

const {
  webApi: { AUTH_AGE },
} = require('../../config');

const HEADER_TOKEN = 'x-token';
const HEADER_TOKEN_EXPIRE = 'x-token-expire';

function set() {
  const maxAge = Number(AUTH_AGE);
  if (Number.isNaN(maxAge)) throw new TypeError('AUTH_AGE must be a number!');

  return async (ctx, next) => {
    ctx.assert(ctx.chest, 500, 'Token set error! No chest found!');

    const encryptedToken = webToken.put(ctx.chest);
    ctx.set(HEADER_TOKEN, encryptedToken);
    ctx.set(HEADER_TOKEN_EXPIRE, Date.now() + maxAge);
    await next();
  };
}

function get() {
  let chest;

  return async (ctx, next) => {
    const token = ctx.request.get(HEADER_TOKEN);
    try {
      chest = webToken.get(token);
    } catch (err) {
      ctx.throw(401, 'Invalid token!', { error: err });
    }

    ctx.chest = chest;
    await next();
  };
}

module.exports = {
  set,
  get,
};
