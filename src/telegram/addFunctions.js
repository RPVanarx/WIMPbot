const bot = require('./bot');
const { CREATE_MESSAGE_TEXTS, MODER_BUTTON, MODERATOR_GROUP_ID } = require('../config');

function createMessage(request) {
  return `${CREATE_MESSAGE_TEXTS.TYPE} ${
    request.request_type === 'search'
      ? CREATE_MESSAGE_TEXTS.ANSWER_SEARCH
      : CREATE_MESSAGE_TEXTS.ANSWER_FOUND
  }
${CREATE_MESSAGE_TEXTS.PLATFORM} ${
    request.platform_type === 'telegram'
      ? CREATE_MESSAGE_TEXTS.PLATFORM_TELEGRAM
      : CREATE_MESSAGE_TEXTS.PLATFORM_VIBER
  }
${CREATE_MESSAGE_TEXTS.SENDER} ${request.platform_type === 'telegram' ? '@' : ''}${
    request.user_name
  }
${CREATE_MESSAGE_TEXTS.DATE} ${request.creation_date.toLocaleString()}
${CREATE_MESSAGE_TEXTS.MESSAGE_FROM_USER} ${request.message}
${CREATE_MESSAGE_TEXTS.LOCATION} ${CREATE_MESSAGE_TEXTS.BASE_LINE}${request.location.y},${
    request.location.x
  })`;
}

function sendPhotoMessage({ request, chatId }) {
  bot.telegram.sendPhoto(chatId, request.photo, {
    // reply_markup: {
    //   inline_keyboard: [[{ text: 'дати коментар', callback_data: `comment:${request.reqId}` }]],
    // },
    caption: createMessage(request),
    parse_mode: 'Markdown',
  });
}

function sendPhotoMessageToModerate({ request, moderatorId }) {
  bot.telegram.sendPhoto(moderatorId, request.photo, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MODER_BUTTON.APPROVE,
            callback_data: MODER_BUTTON.CB_MODERATE + request.id + MODER_BUTTON.CB_TRUE,
          },
        ],
        [
          {
            text: MODER_BUTTON.DECLINE,
            callback_data: MODER_BUTTON.CB_MODERATE + request.id + MODER_BUTTON.CB_FALSE,
          },
        ],
      ],
    },
    caption: createMessage(request),
    parse_mode: 'Markdown',
  });
}

function sendMessage(id, message) {
  return bot.telegram.sendMessage(id, message);
}

function getFileLink(id) {
  return bot.telegram.getFileLink(id);
}

async function sendPhotoStream(readStream) {
  const newPhotoId = await bot.telegram.sendPhoto(
    MODERATOR_GROUP_ID,
    { source: readStream },
    { disable_notification: true },
  );
  bot.telegram.deleteMessage(MODERATOR_GROUP_ID, newPhotoId.message_id);
  return newPhotoId.photo[newPhotoId.photo.length - 1].file_id;
}

module.exports = {
  sendPhotoMessage,
  sendPhotoMessageToModerate,
  sendMessage,
  getFileLink,
  sendPhotoStream,
};
