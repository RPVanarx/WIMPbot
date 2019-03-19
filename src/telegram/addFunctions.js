const bot = require('./bot');
const { CREATE_MESSAGE_TEXTS, MODER_BUTTON } = require('../config');

function createMessage(request) {
  return `${CREATE_MESSAGE_TEXTS.TYPE} ${
    request.requestType === 'search'
      ? CREATE_MESSAGE_TEXTS.ANSWER_SEARCH
      : CREATE_MESSAGE_TEXTS.ANSWER_FOUND
  }
${CREATE_MESSAGE_TEXTS.PLATFORM} ${
    request.platformType === 'telegram'
      ? CREATE_MESSAGE_TEXTS.PLATFORM_TELEGRAM
      : CREATE_MESSAGE_TEXTS.PLATFORM_VIBER
  }
${CREATE_MESSAGE_TEXTS.SENDER} ${request.platformType === 'telegram' ? '@' : ''}${request.userName}
${CREATE_MESSAGE_TEXTS.DATE} ${request.creationDate.toLocaleString()}
${CREATE_MESSAGE_TEXTS.MESSAGE_FROM_USER} ${request.message}`;
}

function sendPhotoMessage({ request, chatId }) {
  bot.telegram.sendPhoto(chatId, request.photo, {
    // reply_markup: {
    //   inline_keyboard: [[{ text: 'дати коментар', callback_data: `comment:${request.reqId}` }]],
    // },
    caption: createMessage({
      requestType: request.request_type,
      platformType: request.platform_type,
      userName: request.user_name,
      creationDate: request.creation_date,
      message: request.message,
    }),
  });
}

function sendPhotoMessageToModerate({ request, moderatorId }) {
  bot.telegram.sendPhoto(moderatorId, request.photo, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MODER_BUTTON.APPROVE,
            callback_data: MODER_BUTTON.CB_MODERATE + request.reqId + MODER_BUTTON.CB_TRUE,
          },
        ],
        [
          {
            text: MODER_BUTTON.DECLINE,
            callback_data: MODER_BUTTON.CB_MODERATE + request.reqId + MODER_BUTTON.CB_FALSE,
          },
        ],
      ],
    },
    caption: createMessage(request),
  });
}

module.exports = { sendPhotoMessage, sendPhotoMessageToModerate };
