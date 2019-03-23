const { WEB_API_JSON_ERROR_NAME: ERROR } = require('../../config');

function setError(obj = {}, errorMessage = '') {
  return { ...obj, [ERROR]: errorMessage };
}

function addError(obj, errorMessage = '') {
  obj[ERROR] = obj[ERROR] ? `${obj[ERROR]} ${errorMessage}` : errorMessage;
  return obj;
}

function setMessage(ctx, status, errorMessage) {
  ctx.status = status;

  if (ctx.accepts('json')) {
    ctx.body = setError({}, errorMessage);
    return;
  }

  ctx.type = 'text';
  ctx.body = errorMessage;
}

function set400(ctx, message = '') {
  const errorMessage = message ? `Bad request: ${message}` : 'Bad request';
  setMessage(ctx, 400, errorMessage);
}

function set401(ctx, message = '') {
  const errorMessage = message ? `Unauthorized request: ${message}` : 'Unauthorized request';
  setMessage(ctx, 401, errorMessage);
}

function set404(ctx, message = '') {
  const errorMessage = message ? `Not found: ${message}` : 'Not found';
  setMessage(ctx, 404, errorMessage);
}

function set405(ctx, message = '') {
  const errorMessage = message ? `Method not allowed: ${message}` : 'Method not allowed';
  setMessage(ctx, 405, errorMessage);
}

function set415(ctx, message = '') {
  const errorMessage = message ? `Unsupported media type: ${message}` : 'Unsupported media type';
  setMessage(ctx, 415, errorMessage);
}

function handleError(err, ctx) {
  switch (err.status) {
    case 400:
      set400(ctx, err.message);
      return true;
    case 401:
      set401(ctx, err.message);
      ctx.app.emit('error', err.error, ctx);
      return true;
    case 404:
      set404(ctx, err.message);
      ctx.app.emit('error', err.error, ctx);
      return true;
    case 405:
      set405(ctx, err.message);
      return true;
    case 415:
      set415(ctx, err.message);
      return true;

    default:
      return false;
  }
}

module.exports = {
  handleError,
  setError,
  addError,
  set404,
};
