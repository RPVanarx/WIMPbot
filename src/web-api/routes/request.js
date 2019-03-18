const path = require('path');
const { createRequest } = require('../../services');
const validator = require('../utils/validator');

const {
  WEB_API_V1_PREFIX,
  WEB_API_PATH_REQUEST: SUFFIX,
  PLATFORM_TYPE_TELEGRAM,
  REQUEST_TYPE_SEARCH,
  WEB_PHOTO_FILE_SIZE_MAX,
  WEB_UPLOAD_TMP_DIR,
} = require('../../config');

const route = path.join(WEB_API_V1_PREFIX, SUFFIX);

function onKoaBodyError(err, ctx) {
  ctx.assert(
    !err.message && !err.message.includes('maxFileSize exceeded'),
    400,
    `File is too large! Must be less that ${WEB_PHOTO_FILE_SIZE_MAX} bytes!`,
  );

  ctx.throw(500, 'Cannot parse POST body', { error: err });
}

// function onPhotoUlpoad(name, file) {
// }

// eslint-disable-next-line import/order
const koaBody = require('koa-body')({
  multipart: true,
  onError: onKoaBodyError,
  formidable: {
    maxFileSize: WEB_PHOTO_FILE_SIZE_MAX,
    uploadDir: WEB_UPLOAD_TMP_DIR,
    // onFileBegin: onPhotoUlpoad,
  },
});

function validatePost(ctx) {
  let errors = [];
  try {
    errors = validator.requestQuery(ctx.request);
  } catch (err) {
    ctx.throw(500, 'POST body validation failed!', { error: err });
  }

  try {
    errors = [...errors, ...validator.photoUpload(ctx.request)];
  } catch (err) {
    ctx.throw(500, 'POST file validation failed!', { error: err });
  }
  // TODO: remove photo if uploaded with errors
  ctx.assert(!errors.length, 400, errors.join(' '));
}

async function getUser({ token }) {
  // TODO: get user data
  const { userId, userName } = { userId: 1, userName: 'Vasya' }//getOwner(token);
  return { userId, userName };
}

async function getPhotoId({ path }) {
  // TODO: get photo id
  // return //some fancy method to get id
  return path;
}

function formRequest(body, userName, platformId, photo) {
  return {
    userName,
    platformId,
    platformType: PLATFORM_TYPE_TELEGRAM,
    requestType: REQUEST_TYPE_SEARCH,
    longitude: body.lon,
    latitude: body.lat,
    photo,
    message: body.msg,
  };
}

async function handlePost(ctx) {
  validatePost(ctx);

  const { userName, userId } = getUser(ctx.request.body);

  let photoId = null;
  try {
    photoId = await getPhotoId(ctx.request.files.photo);
  } catch (err) {
    ctx.throw(500, 'Server error: Cannot upload photo!', { error: err });
  }

  const request = formRequest(ctx.request.body, userName, userId, photoId);

  let requestId;
  try {
    requestId = await createRequest(request);
  } catch (err) {
    ctx.throw(500, 'Cannot create request!', { error: err });
  }

  ctx.body = { request: requestId.toString() };

  // ctx.body = JSON.stringify({ body: ctx.request.body, files: ctx.request.files }, null, 2);
}

module.exports = ({ router }) => {
  router.post(route, koaBody, async ctx => handlePost(ctx));
};
