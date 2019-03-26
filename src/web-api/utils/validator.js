const { Validator, Rule } = require('@cesium133/forgjs');
const { DEFAULT_VALUES } = require('../../config');

// HACK: Valid for 1.1.8 forgjs
// TODO: Remove next block when
// https://github.com/oussamahamdaoui/forgJs/issues/65
// is fixed
function removeBugsDecorator(func) {
  // eslint-disable-next-line func-names
  return function(...args) {
    // Removes duplicates from array
    return [...new Set(func.apply(this, args))];
  };
}
Validator.prototype.getErrors = removeBugsDecorator(Validator.prototype.getErrors);
// block end -----

const location = new Validator({
  lon: new Rule(
    {
      type: 'string-float|string-int',
      min: DEFAULT_VALUES.LONGITUDE_MIN,
      max: DEFAULT_VALUES.LONGITUDE_MAX,
    },
    `Longitude must be a number in range ${DEFAULT_VALUES.LONGITUDE_MIN} to ${
      DEFAULT_VALUES.LONGITUDE_MAX
    }!`,
  ),
  lat: new Rule(
    {
      type: 'string-float|string-int',
      min: DEFAULT_VALUES.LATITUDE_MIN,
      max: DEFAULT_VALUES.LATITUDE_MAX,
    },
    `Latitude must be a number in range ${DEFAULT_VALUES.LATITUDE_MIN} to ${
      DEFAULT_VALUES.LATITUDE_MAX
    }!`,
  ),
});

const daysAndRadius = new Validator({
  r: new Rule(
    { type: 'string-int', min: DEFAULT_VALUES.RADIUS_MIN, max: DEFAULT_VALUES.RADIUS_MAX },
    `Radius must be an integer in range ${DEFAULT_VALUES.RADIUS_MIN} to ${
      DEFAULT_VALUES.RADIUS_MAX
    }!`,
  ),
  d: new Rule(
    { type: 'string-int', min: DEFAULT_VALUES.DAYS_MIN, max: DEFAULT_VALUES.DAYS_MAX },
    `Days must be an integer in range ${DEFAULT_VALUES.DAYS_MIN} to ${DEFAULT_VALUES.DAYS_MAX}!`,
  ),
});

const photoUpload = new Validator({
  type: new Rule({ type: 'string', match: /^image\/.+/ }, `Photo must be of type 'image/*'!`),
  fieldName: new Rule({ type: 'string', equal: 'photo' }, 'Unexpected field name of file!'),
});

const requestFieldsOptional = new Validator({
  msg: new Rule(
    { type: 'string', minLength: 1, maxLength: DEFAULT_VALUES.REQUEST_MESSAGE_MAX, optional: true },
    `Message must not be empty, must not exceed ${DEFAULT_VALUES.REQUEST_MESSAGE_MAX} symbols!`,
  ),
  lon: new Rule(
    { type: 'string-float|string-int', min: -180, max: 180, optional: true },
    'Longitude must be a number in range -180 to 180!',
  ),
  lat: new Rule(
    { type: 'string-float|string-int', min: -90, max: 90, optional: true },
    'Latitude must be a number in range -90 to 90!',
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

  signupQuery({ lon, lat }) {
    return [...location.getErrors({ lon, lat })];
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
    return [...errors, ...requestFieldsPresense.getErrors({ msg, lon, lat, token })];
  },
};
