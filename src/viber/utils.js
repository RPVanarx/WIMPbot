const TextMessage = require('viber-bot').Message.Text;
const PictureMessage = require('viber-bot').Message.Picture;
const bot = require('./bot');
const {
  localesUA: { CREATE_MESSAGE_TEXTS },
  platformType: { VIBER, TELEGRAM },
  telegramEvents: {
    BUTTONS: { SEARCH },
  },
} = require('../config');
const getCurrentKeyboard = require('./getCurrentKeyboard');

function createMessage(request) {
  return `${CREATE_MESSAGE_TEXTS.REQUEST}${request.id}
${CREATE_MESSAGE_TEXTS.TYPE} ${
    request.request_type === SEARCH
      ? CREATE_MESSAGE_TEXTS.ANSWER_SEARCH
      : CREATE_MESSAGE_TEXTS.ANSWER_FOUND
  }
${CREATE_MESSAGE_TEXTS.PLATFORM} ${request.platform_type === TELEGRAM ? TELEGRAM : VIBER}
${CREATE_MESSAGE_TEXTS.SENDER} ${
    request.platform_type === TELEGRAM ? `${CREATE_MESSAGE_TEXTS.TELEGRAM_URL}` : ''
  }${request.user_name}
${CREATE_MESSAGE_TEXTS.DATE} ${request.creation_date.toLocaleString()}
${CREATE_MESSAGE_TEXTS.LOCATION} ${CREATE_MESSAGE_TEXTS.URL}${request.location.y},${
    request.location.x
  }
${CREATE_MESSAGE_TEXTS.MESSAGE_FROM_USER} ${request.message}`;
}

async function sendPhotoMessageViber({ chatId, request, photo }) {
  const keyboard = await getCurrentKeyboard(chatId);
  const message = createMessage(request);
  bot.sendMessage({ id: chatId }, [
    new PictureMessage(photo, `${CREATE_MESSAGE_TEXTS.REQUEST}${request.id}`),
    new TextMessage(message),
    keyboard,
  ]);
}

function sendOwnMessage({ chatId, request, photo }) {
  const message = createMessage(request);
  bot.sendMessage({ id: chatId }, [
    new PictureMessage(photo, `${CREATE_MESSAGE_TEXTS.REQUEST}${request.id}`),
    new TextMessage(message),
  ]);
}

async function sendMessageViber(platformId, message) {
  const keyboard = await getCurrentKeyboard(platformId);
  bot.sendMessage({ id: platformId }, [new TextMessage(message), keyboard]);
}

module.exports = { sendPhotoMessageViber, sendMessageViber, sendOwnMessage };
