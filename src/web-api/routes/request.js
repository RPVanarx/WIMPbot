const path = require('path');
const busboy = require('busboy');
const { createRequest, sendPhotoStream /* getTelegramUserName */ } = require('../../services');
const validator = require('../utils/validator');
const { isExpired, getUserCredentials } = require('../utils/web-token');

const {
  WEB_API_V1_PREFIX,
  WEB_API_PATH_REQUEST: SUFFIX,
  PLATFORM_TYPE_TELEGRAM,
  BUTTON_EVENT: { SEARCH: REQUEST_TYPE_SEARCH },
  WEB_PHOTO_FILE_SIZE_MAX,
  WEB_POST_FIELD_LENGTH_MAX,
} = require('../../config');

const POST_FIELDS_MAX = 4;
const POST_FILES_MAX = 1;
const route = path.join(WEB_API_V1_PREFIX, SUFFIX);

function createCustomError(status, message, originalError = null) {
  const error = new Error(message);
  error.status = status;

  if (originalError === null) error.originalError = originalError;

  return error;
}

async function formRequest(body, platformId, photo) {
  return {
    userName: 'fixme', // await getTelegramUserName(platformId),
    platformId,
    platformType: PLATFORM_TYPE_TELEGRAM,
    requestType: REQUEST_TYPE_SEARCH,
    longitude: body.lon,
    latitude: body.lat,
    photo,
    message: body.msg,
  };
}

function validateFields(reject, { msg, lon, lat, token }) {
  try {
    const errors = validator.requestFieldsOptional({ msg, lon, lat, token });

    if (errors.length) reject(createCustomError(400, errors.join(' ')));
  } catch (err) {
    reject(createCustomError(500, 'POST field validation failed!', err));
  }
}

function validateFilePhoto(reject, { fieldName, type }) {
  try {
    const errors = validator.photoUpload({ fieldName, type });

    if (errors.length) reject(createCustomError(400, errors.join(' ')));
  } catch (err) {
    reject(createCustomError(500, 'POST file validation failed!', err));
  }
}

function validateFormData(ctx, formData) {
  let errors = [];
  try {
    errors = validator.requestFormData(formData);
  } catch (err) {
    ctx.throw(500, 'POST file validation failed!', { error: err });
  }

  ctx.assert(!errors.length, 400, errors.join(' '));
}

function readPostForm(ctx) {
  const contentType = ctx.request.header['content-type'] || '';
  ctx.assert(
    contentType.startsWith('multipart/form-data'),
    400,
    `Wrong 'content-type'! Expected 'multipart/form-data'`,
  );

  // TODO: move busboy promise to a file
  return new Promise((resolve, rej) => {
    const fields = {};
    let photoUploadPromise = null;
    let uploader = null;

    function reject(error) {
      if (photoUploadPromise !== null) {
        // TODO: move photo upload to a service
        photoUploadPromise
          .then(id => console.log(`Rejected file uploaded: ${id}`))
          .catch(err => console.log(`Cannot upload rejected file ${err.message}`));
      }
      rej(error);
    }

    try {
      uploader = busboy({
        headers: ctx.req.headers,
        limits: {
          fieldSize: WEB_POST_FIELD_LENGTH_MAX,
          fields: POST_FIELDS_MAX,
          fileSize: WEB_PHOTO_FILE_SIZE_MAX,
          files: POST_FILES_MAX,
          parts: POST_FIELDS_MAX + POST_FILES_MAX,
        },
      });
    } catch (err) {
      reject(createCustomError(400, err.message));
    }

    uploader.on('error', err => reject(createCustomError(500, 'Cannot parse POST!', err)));

    uploader.on('field', (fieldName, value) => {
      validateFields(reject, { [fieldName]: value });
      fields[fieldName] = value;
    });

    uploader.on('file', (fieldName, readableStream, fileName, encoding, mimeType) => {
      validateFilePhoto(reject, { fieldName, type: mimeType });

      if (photoUploadPromise !== null) {
        readableStream.resume(); // Flush stream
        reject(createCustomError(500, 'Cannot upload twice! Photo is already uploadind!'));
      }

      fields.fileStream = readableStream;
      photoUploadPromise = sendPhotoStream(readableStream);
    });

    uploader.on('partsLimit', () =>
      reject(
        createCustomError(400, `Too many body parts! Expected ${POST_FILES_MAX + POST_FIELDS_MAX}`),
      ),
    );

    uploader.on('filesLimit', () =>
      reject(createCustomError(400, `Too many files! Expected ${POST_FILES_MAX}`)),
    );

    uploader.on('fieldsLimit', () =>
      reject(createCustomError(400, `Too many fields! Expected: ${POST_FIELDS_MAX}`)),
    );

    uploader.on('finish', () => resolve({ ...fields, photoUploadPromise }));

    ctx.req.pipe(uploader);
  });
}

async function getRequest(ctx) {
  let formData = null;
  try {
    formData = await readPostForm(ctx);
  } catch (err) {
    ctx.throw(err.status, err.message, { error: err.error });
  }

  validateFormData(ctx, formData);
  let isTokenExpired = null;
  try {
    isTokenExpired = isExpired(formData.token);
  } catch (err) {
    ctx.throw(401, 'Invalid token!', { error: err });
  }
  if (isTokenExpired) ctx.throw(401, 'Token expired!');

  const { id: platformId } = getUserCredentials(formData.token);

  let photoId = null;
  try {
    // TODO: move to photo upload service
    photoId = await formData.photoUploadPromise;
  } catch (err) {
    if (err.code === 400) {
      if (err.message && err.message.endsWith('IMAGE_PROCESS_FAILED')) {
        ctx.throw(
          err.code,
          `Too big image or invalid image data! Maximum image size: ${WEB_PHOTO_FILE_SIZE_MAX} bytes`,
          { error: err },
        );
      }
      ctx.throw(err.code, err.message, { error: err });
    }
    ctx.throw(500, 'Cannot upload photo!', { error: err });
  }
  return formRequest(formData, platformId, photoId);
}

async function handlePost(ctx) {
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

module.exports = ({ router }) => {
  router.post(route, async ctx => handlePost(ctx));
};
