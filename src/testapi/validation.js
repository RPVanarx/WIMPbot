const { Validator, Rule } = require('@cesium133/forgjs');

const requestValidator = new Validator({
  latitude: new Rule(
    { type: 'float|int', min: -180, max: 180 },
    'latitude must be float or integer and between -180 and 180',
  ),
  longitude: new Rule(
    { type: 'float|int', min: -90, max: 90 },
    'longitude must be float or integer and between -90 and 90',
  ),
  radius: new Rule(
    { type: 'int', min: 50, max: 10000 },
    'radius must be integer and between 50 and 10000',
  ),
  days: new Rule({ type: 'int', min: 1, max: 30 }, 'days must be integer and between 1 and 30'),
});

module.exports = requestValidator;
