const busboy = require('busboy');

function createError(status, message, originalError = null) {
  const error = new Error(message);
  error.status = status;

  if (originalError !== null) error.error = originalError;

  return error;
}

function initBusboy(ctx, options) {
  const contentType = ctx.request.header['content-type'] || '';
  if (!contentType.startsWith('multipart/form-data')) {
    const error = new Error(`Wrong 'content-type'! Expected 'multipart/form-data'`);
    error.status = 400;
    throw error;
  }

  try {
    return busboy(options);
  } catch (err) {
    err.status = 400;
    throw err;
  }
}

function setErrorHandlers(reject, uploader, options) {
  uploader.on('error', err => reject(createError(500, 'Cannot parse POST!', err)));

  if (!options.limits) return;

  const { parts, files, fields, fileSize } = options.limits;

  if (parts >= 0) {
    uploader.on('partsLimit', () =>
      reject(createError(400, `Too many body parts! Expected ${parts}`)),
    );
  }

  if (files >= 0) {
    uploader.on('filesLimit', () => reject(createError(400, `Too many files! Expected ${files}`)));
  }

  if (fields >= 0) {
    uploader.on('fieldsLimit', () =>
      reject(createError(400, `Too many fields! Expected ${fields}`)),
    );
  }

  if (fileSize >= 0) {
    uploader.on('limit', () =>
      reject(createError(400, `File size limit reached! Expected ${fileSize} bytes or less`)),
    );
  }
}

function setPartHandlers(reject, uploader, parts, fieldHandler, fileHandler) {
  uploader.on('field', (name, value, isNameTrunc, isValueTrunc, encoding, mimeType) => {
    if (!fieldHandler) {
      parts.fields[name] = { value, isNameTrunc, isValueTrunc, encoding, mimeType };
    }

    try {
      const result = fieldHandler(name, value, isNameTrunc, isValueTrunc, encoding, mimeType);
      parts.fields[name] = result;
    } catch (err) {
      reject(err);
    }
  });

  uploader.on('file', (fieldName, stream, fileName, encoding, mimeType) => {
    if (!fileHandler) parts.files[fieldName] = { stream, fileName, encoding, mimeType };

    parts.files[fieldName] = fileHandler(fieldName, stream, fileName, encoding, mimeType);
  });
}

function parse(ctx, fieldHandler = null, fileHandler = null, options = {}) {
  const uploader = initBusboy(ctx, options);

  return new Promise((resolve, reject) => {
    function terminate(err) {
      uploader.destroy();
      reject(err);
    }

    setErrorHandlers(terminate, uploader, options);

    const parts = {
      fields: {},
      files: {},
    };

    setPartHandlers(terminate, uploader, parts, fieldHandler, fileHandler);

    uploader.on('finish', () => resolve(parts));

    ctx.req.pipe(uploader);
  });
}

module.exports = parse;
