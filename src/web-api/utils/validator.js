const { Validator, Rule } = require('@cesium133/forgjs');

// HACK: TODO: Remove next block when
// https://github.com/oussamahamdaoui/forgJs/issues/65
// and
// https://github.com/oussamahamdaoui/forgJs/issues/66
// are fixed
function removeBugsDecorator(func) {
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

// TODO: move contants to config
const WEB_USER_TOKEN_LENGTH = 64;
const WEB_PHOTO_UPLOAD_SIZE_MAX = 1024 * 1024 * 16; // 16 MiB
const WEB_PHOTO_UPLOAD_SIZE_MIN = 1024; // 1 KiB

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

const requestMessage = new Validator({
  msg: new Rule({ type: 'string', minLength: 1, optional: true }, 'Message must not be empty!'),
});

const webToken = new Validator({
  token: new Rule(
    { type: 'string', custom: token => token.length === WEB_USER_TOKEN_LENGTH },
    'Invalid token!',
  ),
});

const photoUpload = new Validator({
  size: new Rule(
    { type: 'int', min: WEB_PHOTO_UPLOAD_SIZE_MIN, max: WEB_PHOTO_UPLOAD_SIZE_MAX },
    `Photo size must be in range ${WEB_PHOTO_UPLOAD_SIZE_MIN} to ${WEB_PHOTO_UPLOAD_SIZE_MAX} bytes`,
  ),
  type: new Rule({ type: 'string', match: /^image\/.+/ }, `Photo must be of type 'image/*'`),
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

  requestQuery({ msg, lon, lat, token }) {
    return [
      ...location.getErrors({ lon, lat }),
      ...webToken.getErrors({ token }),
      ...requestMessage.getErrors({ msg }),
    ];
  },

  photoUpload({ photo }) {
    if (!photo) return ["File field 'photo' must not be empty"];
    const { size, type } = photo;
    return photoUpload.getErrors({ size, type });
  },
};
