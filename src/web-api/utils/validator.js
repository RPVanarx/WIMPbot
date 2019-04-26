const { Validator, Rule } = require('@cesium133/forgjs');

const globalValidator = require('../../utils/global-validator');

const photoUploadValidator = new Validator({
  type: new Rule(
    {
      type: 'string',
      match: /^image\/.+/,
    },
    `Photo must be of type 'image/*'!`,
  ),
  fieldName: new Rule(
    {
      type: 'string',
      equal: 'photo',
    },
    'Unexpected field name of file!',
  ),
});

const requestFieldsPresenсeValidator = new Validator({
  lon: new Rule({ type: 'string' }, `'longitude' field not found!`),
  lat: new Rule({ type: 'string' }, `'latitude' field not found!`),
  msg: new Rule({ type: 'string' }, `'message' field not found!`),
});

module.exports = {
  listQuery({ d, r, lon, lat }) {
    return [
      ...globalValidator.location({ lon, lat }),
      ...globalValidator.daysAndRadius({ days: d, radius: r }),
    ];
  },

  signupQuery({ lon, lat }) {
    return [...globalValidator.location({ lon, lat })];
  },

  requestFormFieldsOptional({ msg, lon, lat }) {
    let errors = [];
    if (msg != null) {
      errors = [...errors, ...globalValidator.messageRequest({ message: msg })];
    }
    if (lon != null) {
      errors = [...errors, ...globalValidator.longitude({ lon })];
    }
    if (lat != null) {
      errors = [...errors, ...globalValidator.latitude({ lat })];
    }
    return errors;
  },

  requestFormPresence({ photo, msg, lon, lat }) {
    const errors = [];
    if (!(photo instanceof Promise)) {
      errors.push('No photo provided!');
    }
    return [...errors, ...requestFieldsPresenсeValidator.getErrors({ msg, lon, lat })];
  },

  photoUpload({ fieldName, type }) {
    return photoUploadValidator.getErrors({ fieldName, type });
  },
};
