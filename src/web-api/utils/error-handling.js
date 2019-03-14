// TODO: move to config
const ERROR_NAME = 'error';

function setError(obj = {}, errorMessage = '') {
  return { ...obj, [ERROR_NAME]: errorMessage };
}

function addError(obj, errorMessage = '') {
  obj[ERROR_NAME] = obj[ERROR_NAME] ? `${obj[ERROR_NAME]} ${errorMessage}` : errorMessage;
  return obj;
}

function set400(ctx, message = '') {
  const errorMessage = message ? `Bar request: ${message}` : 'Bad request';

  ctx.status = 400;

  if (ctx.accepts('json')) {
    ctx.body = setError({}, errorMessage);
    return;
  }

  ctx.type = 'text';
  ctx.body = errorMessage;
}

function set404(ctx, message = '') {
  const errorMessage = message ? `Not found: ${message}` : 'Not found';
  ctx.status = 404;

  if (ctx.accepts('json')) {
    ctx.body = setError({}, errorMessage);
    return;
  }

  ctx.type = 'text';
  ctx.body = errorMessage;
}

function set415(ctx, message = '') {
  const errorMessage = message ? `Unsupported media type: ${message}` : 'Unsupported media type';

  ctx.status = 415;

  if (ctx.accepts('json')) {
    ctx.body = setError({}, errorMessage);
    return;
  }

  ctx.type = 'text';
  ctx.body = errorMessage;
}

function handleError(err, ctx) {
  switch (err.status) {
    case 400:
      set400(ctx, err.message);
      return true;
    case 404:
      set404(ctx, err.message);
      ctx.app.emit('error', err.error, ctx);
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
