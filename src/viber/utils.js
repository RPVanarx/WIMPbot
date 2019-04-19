const TextMessage = require('viber-bot').Message.Text;
const PictureMessage = require('viber-bot').Message.Picture;
const bot = require('./bot');
const { CREATE_MESSAGE_TEXTS } = require('../config');

function createMessage(request) {
  return `Заявка №${request.id}
${CREATE_MESSAGE_TEXTS.TYPE} ${
    request.request_type === 'search'
      ? CREATE_MESSAGE_TEXTS.ANSWER_SEARCH
      : CREATE_MESSAGE_TEXTS.ANSWER_FOUND
  }
${CREATE_MESSAGE_TEXTS.PLATFORM} ${
    request.platform_type === 'telegram'
      ? CREATE_MESSAGE_TEXTS.PLATFORM_TELEGRAM
      : CREATE_MESSAGE_TEXTS.PLATFORM_VIBER
  }
${CREATE_MESSAGE_TEXTS.SENDER} ${request.platform_type === 'telegram' ? 'https://t.me/' : ''}${
    request.user_name
  }
${CREATE_MESSAGE_TEXTS.DATE} ${request.creation_date.toLocaleString()}
${CREATE_MESSAGE_TEXTS.LOCATION} ${CREATE_MESSAGE_TEXTS.URL}${request.location.y},${
    request.location.x
  }
${CREATE_MESSAGE_TEXTS.MESSAGE_FROM_USER} ${request.message}`;
}

function sendPhotoMessageViber({ chatId, request, photo }) {
  const message = createMessage(request);
  bot.sendMessage({ id: chatId }, [
    new PictureMessage(photo, `Заявка №${request.id}`),
    new TextMessage(message),
  ]);
}

function sendMessageViber(platformId, message) {
  bot.sendMessage({ id: platformId }, new TextMessage(message));
}

module.exports = { sendPhotoMessageViber, sendMessageViber };
