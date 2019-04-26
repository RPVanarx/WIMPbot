const {
  localesUA: { CREATE_MESSAGE_TEXTS },
  platformType: { TELEGRAM, VIBER },
  telegramEvents: {
    BUTTONS: { SEARCH },
  },
} = require('../config');

const requestId = id => {
  return `${CREATE_MESSAGE_TEXTS.REQUEST}${id}`;
};

const requestType = type => {
  return `${CREATE_MESSAGE_TEXTS.TYPE} ${
    type === SEARCH ? CREATE_MESSAGE_TEXTS.ANSWER_SEARCH : CREATE_MESSAGE_TEXTS.ANSWER_FOUND
  }`;
};

const messangerType = messanger => {
  return `${CREATE_MESSAGE_TEXTS.PLATFORM} ${messanger}`;
};

const requestSender = (username, recieverPlatformType, senderPlarformType) => {
  if (recieverPlatformType === TELEGRAM) {
    return `${CREATE_MESSAGE_TEXTS.SENDER} ${
      senderPlarformType === TELEGRAM ? '@' : ''
    }${username}`;
  }
  return `${CREATE_MESSAGE_TEXTS.SENDER} ${
    senderPlarformType === TELEGRAM ? CREATE_MESSAGE_TEXTS.TELEGRAM_URL : ''
  }${username}`;
};

const requestDate = date => {
  return `${CREATE_MESSAGE_TEXTS.DATE} ${date.toLocaleString()}`;
};

const requestLocation = (latitude, longitude, recieverPlatformType) => {
  if (recieverPlatformType === TELEGRAM)
    return `${CREATE_MESSAGE_TEXTS.LOCATION} ${
      CREATE_MESSAGE_TEXTS.LOCATION_LINE_BEGIN
    }${latitude},${longitude}${CREATE_MESSAGE_TEXTS.LOCATION_LINE_END}`;
  return `${CREATE_MESSAGE_TEXTS.LOCATION} ${CREATE_MESSAGE_TEXTS.URL}${latitude},${longitude}`;
};

const userMessage = message => {
  return `${CREATE_MESSAGE_TEXTS.MESSAGE_FROM_USER} ${message}`;
};

module.exports = (request, recievePlatform) => {
  return `${recievePlatform === VIBER ? requestId(request.id) : ''}
${requestType(request.requestType)}
${messangerType(request.platformType)}
${requestSender(request.userName, recievePlatform, request.platformType)}
${requestDate(request.creationDate)}
${requestLocation(request.latitude, request.longitude, recievePlatform)}
${userMessage(request.message)}`;
};
