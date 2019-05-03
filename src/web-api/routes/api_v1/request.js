const Router = require('koa-router');

const {
  request: { create: createRequest },
  photo: { sendPhotoStream },
} = require('../../../services');

const token = require('../../middleware/token');
const multiparse = require('../../utils/multipart-parser');
const validator = require('../../utils/validator');

const {
  webApi: {
    PREFIX: { REQUEST },
    PHOTO_FILE_SIZE_MAX,
  },
  platformType: { TELEGRAM },
  telegramEvents: {
    BUTTONS: { SEARCH: REQUEST_TYPE_SEARCH },
  },
} = require('../../../config');

const POST_FIELDS_MAX = 3;
const POST_FILES_MAX = 1;
const POST_FIELD_LENGTH_MAX = 1024;

const router = new Router({
  prefix: REQUEST,
});

function validateFormData(ctx, { fields: { msg, lon, lat }, files: { photo } }) {
  const errors = validator.requestFormPresence({ msg, lon, lat, photo });
  ctx.assert(!errors.length, 400, errors.join(' '));
}

async function formRequest({ fields: { lon, lat, msg } }, platformId, userName, photo) {
  return {
    userName,
    platformId,
    platformType: TELEGRAM,
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

  return sendPhotoStream(stream);
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
      fieldSize: POST_FIELD_LENGTH_MAX,
      fields: POST_FIELDS_MAX,
      fileSize: PHOTO_FILE_SIZE_MAX,
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
