const { Validator, Rule } = require('@cesium133/forgjs');
const { WEB_USER_TOKEN_LENGTH } = require('../../config');

// HACK: Valid for 1.1.9 forgjs
// TODO: Remove next block when
// https://github.com/oussamahamdaoui/forgJs/issues/65
// and
// https://github.com/oussamahamdaoui/forgJs/issues/66
// are fixed
/*function removeBugsDecorator(func) {
  // eslint-disable-next-line func-names
  return function(...args) {
    // Changes null & undefined to {} to avoid errors
    args.forEach(obj => {
      const keys = Object.keys(obj);
      keys.forEach(key => {
        if (obj[key] == null) obj[key] = {};
      });
    });
    // Removes duplicates from array
    return [...new Set(func.apply(this, args))];
  };
}
Validator.prototype.getErrors = removeBugsDecorator(Validator.prototype.getErrors);
// block end -----
*/
const location = new Validator({
  lon: new Rule(
    { type: 'string-float|string-int', min: -180, max: 180 },
    'Longitude must be a number in range -180 to 180!',
  ),
  lat: new Rule(
    { type: 'string-float|string-int', min: -90, max: 90 },
    'Latitude must be a number in range -90 to 90!',
  ),
});

const daysAndRadius = new Validator({
  r: new Rule({ type: 'string-int', min: 0 }, 'Radius must be an integer bigger than 0!'),
  d: new Rule({ type: 'string-int', min: 0 }, 'Days must be an integer bigger than 0!'),
});

const webToken = new Validator({
  token: new Rule(
    { type: 'string', minLength: WEB_USER_TOKEN_LENGTH, maxLength: WEB_USER_TOKEN_LENGTH },
    'Invalid token!',
  ),
});

const photoUpload = new Validator({
  type: new Rule({ type: 'string', match: /^image\/.+/ }, `Photo must be of type 'image/*'!`),
  fieldName: new Rule({ type: 'string', equal: 'photo' }, 'Unexpected field name of file!'),
});

const requestFieldsOptional = new Validator({
  msg: new Rule({ type: 'string', minLength: 1, optional: true }, 'Message must not be empty!'),
  lon: new Rule(
    { type: 'string-float|string-int', min: -180, max: 180, optional: true },
    'Longitude must be a number in range -180 to 180!',
  ),
  lat: new Rule(
    { type: 'string-float|string-int', min: -90, max: 90, optional: true },
    'Latitude must be a number in range -90 to 90!',
  ),
  token: new Rule(
    {
      type: 'string',
      minLength: WEB_USER_TOKEN_LENGTH,
      maxLength: WEB_USER_TOKEN_LENGTH,
      optional: true,
    },
    'Invalid token!',
  ),
});

const requestFieldsPresense = new Validator({
  lon: new Rule({ type: 'string' }, `'longitude' field not found!`),
  lat: new Rule({ type: 'string' }, `'latitude' field not found!`),
  msg: new Rule({ type: 'string' }, `'message' field not found!`),
  token: new Rule({ type: 'string' }, `'token' field not found!`),
});

module.exports = {
  listQuery({ d, r, lon, lat }) {
    return [...location.getErrors({ lon, lat }), ...daysAndRadius.getErrors({ d, r })];
  },

  signupQuery({ d, r, lon, lat, token }) {
    return [
      ...location.getErrors({ lon, lat }),
      ...daysAndRadius.getErrors({ d, r }),
      ...webToken.getErrors({ token }),
    ];
  },

  requestFieldsOptional({ msg, lon, lat, token }) {
    return requestFieldsOptional.getErrors({ msg, lon, lat, token });
  },

  photoUpload({ fieldName, type }) {
    return photoUpload.getErrors({ fieldName, type });
  },

  requestFormData({ photoUploadPromise, msg, lon, lat, token }) {
    const errors = [];
    if (!(photoUploadPromise instanceof Promise)) {
      errors.push('No photo provided!');
    }
    return [...errors, ...requestFieldsPresense.getErrors({ msg, token, lon, lat })];
  },
};
