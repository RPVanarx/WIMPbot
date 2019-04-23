const { Validator, Rule } = require('@cesium133/forgjs');
const { defaultValues: DEFAULT_VALUES } = require('../config');

// HACK: Remove duplicates from array
// Valid for 1.1.8 forgjs (1.1.9 still has this bug)
// TODO: Remove next block when
// https://github.com/oussamahamdaoui/forgJs/issues/65
// is fixed
function removeDoubleErrorsDecorator(func) {
  // eslint-disable-next-line func-names
  return function(...args) {
    return [...new Set(func.apply(this, args))];
  };
}
Validator.prototype.getErrors = removeDoubleErrorsDecorator(Validator.prototype.getErrors);
// block end -----

const TYPE = {
  STRING_NUMBER: 'string',
  NUMBER: 'number',
};

function getRuleType(type) {
  switch (type) {
    case TYPE.STRING_NUMBER:
      return 'string-int|string-float';
    case TYPE.NUMBER:
      return 'number';
    default:
      throw new TypeError(`Validator: Unknown type ${type}!`);
  }
}

function getLatitudeValidator(type) {
  const ruleType = getRuleType(type);
  return new Validator({
    lat: new Rule(
      {
        type: ruleType,
        min: DEFAULT_VALUES.LATITUDE_MIN,
        max: DEFAULT_VALUES.LATITUDE_MAX,
      },
      `Latitude must be a number in range ${DEFAULT_VALUES.LATITUDE_MIN} to ${
        DEFAULT_VALUES.LATITUDE_MAX
      }!`,
    ),
  });
}

function getLongitudeValidator(type) {
  const ruleType = getRuleType(type);
  return new Validator({
    lon: new Rule(
      {
        type: ruleType,
        min: DEFAULT_VALUES.LONGITUDE_MIN,
        max: DEFAULT_VALUES.LONGITUDE_MAX,
      },
      `Longitude must be a number in range ${DEFAULT_VALUES.LONGITUDE_MIN} to ${
        DEFAULT_VALUES.LONGITUDE_MAX
      }!`,
    ),
  });
}

const daysValidator = new Validator({
  days: new Rule(
    {
      type: 'string-int',
      min: DEFAULT_VALUES.DAYS_MIN,
      max: DEFAULT_VALUES.DAYS_MAX,
    },
    `Days must be an integer in range ${DEFAULT_VALUES.DAYS_MIN} to ${DEFAULT_VALUES.DAYS_MAX}!`,
  ),
});

const radiusValidator = new Validator({
  radius: new Rule(
    {
      type: 'string-int',
      min: DEFAULT_VALUES.RADIUS_MIN,
      max: DEFAULT_VALUES.RADIUS_MAX,
    },
    `Radius must be an integer in range ${DEFAULT_VALUES.RADIUS_MIN} to ${
      DEFAULT_VALUES.RADIUS_MAX
    }!`,
  ),
});

const messageRequestValidator = new Validator({
  message: new Rule(
    {
      type: 'string',
      minLength: 1,
      maxLength: DEFAULT_VALUES.REQUEST_MESSAGE_MAX,
    },
    `Message must not be empty, must not exceed ${DEFAULT_VALUES.REQUEST_MESSAGE_MAX} symbols!`,
  ),
});

module.exports = {
  TYPE,

  longitude({ lon }, type = TYPE.STRING_NUMBER) {
    return getLongitudeValidator(type).getErrors({ lon });
  },

  latitude({ lat }, type = TYPE.STRING_NUMBER) {
    return getLatitudeValidator(type).getErrors({ lat });
  },

  location({ lon, lat }, type = TYPE.STRING_NUMBER) {
    return [...this.longitude({ lon }, type), ...this.latitude({ lat }, type)];
  },

  days({ days }) {
    return daysValidator.getErrors({ days });
  },

  radius({ radius }) {
    return radiusValidator.getErrors({ radius });
  },

  daysAndRadius({ days, radius }) {
    return [...this.days({ days }), ...this.radius({ radius })];
  },

  messageRequest({ message }) {
    return messageRequestValidator.getErrors({ message });
  },
};
