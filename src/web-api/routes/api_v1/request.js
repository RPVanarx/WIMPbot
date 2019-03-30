const Router = require('koa-router');

const multiparse = require('../../utils/multipart-parser');
const cookies = require('../../utils/cookies');
const validator = require('../../utils/validator');
const photoService = require('../../../utils/photo');
const { createRequest, /* getTelegramUserName */ } = require('../../../services');
const { isExpired, getUserCredentials } = require('../../utils/web-token');

const {
  WEB_API_PATH_REQUEST,
  PLATFORM_TYPE_TELEGRAM,
  BUTTON_EVENT: { SEARCH: REQUEST_TYPE_SEARCH },
  WEB_PHOTO_FILE_SIZE_MAX,
  WEB_POST_FIELD_LENGTH_MAX,
} = require('../../../config');

const router = new Router({
  prefix: WEB_API_PATH_REQUEST,
});

const POST_FIELDS_MAX = 3;
const POST_FILES_MAX = 1;

function validateFormData(ctx, { fields: { msg, lon, lat }, files: { photo } }) {
  let errors = [];
  try {
    errors = validator.requestFormPresence({ msg, lon, lat, photo });
  } catch (err) {
    ctx.throw(500, 'POST file validation failed!', { error: err });
  }

  ctx.assert(!errors.length, 400, errors.join(' '));
}

function validateToken(ctx, token) {
  let isTokenExpired = null;
  try {
    isTokenExpired = isExpired(token);
  } catch (err) {
    ctx.throw(401, 'Invalid token!', { error: err });
  }

  if (isTokenExpired) ctx.throw(401, 'Token expired! Please sign in again!');
}

async function formRequest({ fields: { lon, lat, msg } }, platformId, photo) {
  return {
    userName: 'fixme', // await getTelegramUserName(platformId),
    platformId,
    platformType: PLATFORM_TYPE_TELEGRAM,
    requestType: REQUEST_TYPE_SEARCH,
    longitude: lon,
    latitude: lat,
    photo,
    message: msg,
  };
}

function onFile(fieldName, stream, fileName, encoding, mimeType) {
  let errors = [];
  try {
    errors = validator.photoUpload({ fieldName, type: mimeType });
  } catch (err) {
    stream.resume();
    throw new Error('POST file validation failed!', err);
  }

  if (errors.length) {
    const err = new Error(errors.join(' '));
    err.status = 400;

    stream.resume();
    throw err;
  }

  return photoService.sendPhotoStream(stream);
}

function onField(name, value) {
  let errors = [];
  try {
    errors = validator.requestFormFieldsOptional({ [name]: value });
  } catch (err) {
    throw new Error('POST file validation failed!', err);
  }

  if (errors.length) {
    const err = new Error(errors.join(' '));
    err.status = 400;
    throw err;
  }

  return value;
}

async function readPostForm(ctx) {
  const options = {
    headers: ctx.req.headers,
    limits: {
      fieldSize: WEB_POST_FIELD_LENGTH_MAX,
      fields: POST_FIELDS_MAX,
      fileSize: WEB_PHOTO_FILE_SIZE_MAX,
      files: POST_FILES_MAX,
      parts: POST_FIELDS_MAX + POST_FILES_MAX,
    },
  };

  return multiparse(ctx, onField, onFile, options);
}

async function getRequest(ctx) {
  const token = cookies.getToken(ctx);
  validateToken(ctx, token);

  const { id: platformId } = getUserCredentials(token);

  let formData = null;
  try {
    formData = await readPostForm(ctx);
  } catch (err) {
    ctx.throw(err.status || 500, err.message, { error: err.error });
  }
  validateFormData(ctx, formData);

  let photoId = null;
  try {
    photoId = await formData.files.photo;
  } catch (err) {
    if (err.code === 400) {
      if (err.message && err.message.endsWith('IMAGE_PROCESS_FAILED')) {
        ctx.throw(err.code, `Invalid image!`, { error: err });
      }
      ctx.throw(err.code, err.message, { error: err });
    }
    ctx.throw(500, 'Cannot upload photo!', { error: err });
  }
  return formRequest(formData, platformId, photoId);
}

async function postRequest(ctx) {
  const request = await getRequest(ctx);

  let requestId;
  try {
    requestId = await createRequest(request);
  } catch (err) {
    ctx.throw(500, 'Cannot create request!', { error: err });
  }
  // TODO: start moderation process
  ctx.body = { request: requestId.toString() };
}

router.post('/', postRequest);

module.exports = router;
