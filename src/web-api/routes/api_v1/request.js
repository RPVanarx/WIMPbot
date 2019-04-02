const Router = require('koa-router');

const multiparse = require('../../utils/multipart-parser');
const token = require('../../middleware/token');
const validator = require('../../utils/validator');
const photoService = require('../../../utils/photo');
const { createRequest } = require('../../../services');

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
  const errors = validator.requestFormPresence({ msg, lon, lat, photo });
  ctx.assert(!errors.length, 400, errors.join(' '));
}

async function formRequest({ fields: { lon, lat, msg } }, platformId, userName, photo) {
  return {
    userName,
    platformId,
    platformType: PLATFORM_TYPE_TELEGRAM,
    requestType: REQUEST_TYPE_SEARCH,
    longitude: lon,
    latitude: lat,
    photo,
    message: msg,
  };
}

function throwValidationErrors(errors) {
  const err = new Error(errors.join(' '));
  err.status = 400;
  throw err;
}

function onFile(fieldName, stream, fileName, encoding, mimeType) {
  const errors = validator.photoUpload({ fieldName, type: mimeType });

  if (errors.length) {
    stream.resume();
    throwValidationErrors(errors);
  }

  return photoService.sendPhotoStream(stream);
}

function onField(name, value) {
  const errors = validator.requestFormFieldsOptional({ [name]: value });

  if (errors.length) throwValidationErrors(errors);

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
    if (err.code === 400) ctx.throw(err.code, `Invalid image!`, { error: err });

    ctx.throw(500, 'Cannot upload photo!', { error: err });
  }

  const { id: platformId, name: userName } = ctx.chest;
  return formRequest(formData, platformId, userName, photoId);
}

async function postRequest(ctx) {
  const request = await getRequest(ctx);

  let requestId;
  try {
    requestId = await createRequest(request);
  } catch (err) {
    ctx.throw(500, 'Cannot create request!', { error: err });
  }

  ctx.body = { request: requestId.toString() };
}

router.post('/', token.get(), postRequest);

module.exports = router;
