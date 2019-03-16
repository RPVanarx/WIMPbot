const { Validator, Rule } = require('@cesium133/forgjs');

const WEB_USER_TOKEN_LENGTH = 64;

const location = new Validator({
  lon: new Rule(
    { type: 'string-float|string-int', min: -180, max: 180 },
    'Longitude must be number in range -180 to 180!',
  ),
  lat: new Rule(
    { type: 'string-float|string-int', min: -90, max: 90 },
    'Latitude must be number in range -90 to 90!',
  ),
});

// TODO: Remove next block when
// https://github.com/oussamahamdaoui/forgJs/issues/65
// is fixed
function removeDuplicatesDecorator(func) {
  return (...args) => [...new Set(func.apply(location, args))];
}
location.getErrors = removeDuplicatesDecorator(location.getErrors);
//-----

const daysAndRadius = new Validator({
  r: new Rule({ type: 'string-int', min: 0 }, 'Radius must be integer bigger than 0!'),
  d: new Rule({ type: 'string-int', min: 0 }, 'Days must be integer bigger than 0!'),
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
    console.log(location.getErrors({ lon, lat }));
    return [
      ...location.getErrors({ lon, lat }),
      ...webToken.getErrors({ token }),
      ...requestMessage.getErrors({ msg }),
    ];
  },
};
