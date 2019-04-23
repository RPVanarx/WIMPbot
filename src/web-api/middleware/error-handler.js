const {
  webApi: { WEB_API_JSON_ERROR_NAME: ERROR },
} = require('../../config');

function setErrorJSON(obj = {}, errorMessage = '') {
  return { ...obj, [ERROR]: errorMessage };
}

function setErrorResponse(err, ctx) {
  ctx.status = err.status || 500;

  const defaultMessage = ctx.response.message;
  const errorMessage = err.expose ? `${defaultMessage}: ${err.message}` : defaultMessage;

  if (ctx.accepts('json')) {
    ctx.body = setErrorJSON({}, errorMessage);
  } else {
    ctx.body = errorMessage;
  }
}

async function handler(ctx, next) {
  try {
    await next();

    if (ctx.status === 404) setErrorResponse({ status: 404, message: ctx.response.message }, ctx);
  } catch (err) {
    setErrorResponse(err, ctx);

    ctx.app.emit('error', err, ctx);
  }
}

module.exports = function errorHandler() {
  return handler;
};
