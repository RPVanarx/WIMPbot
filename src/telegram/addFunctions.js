const bot = require('./bot');
const {
  localesUA: { MODER_BUTTON },
  credentials: { MODERATOR_GROUP_ID },
  telegramEvents: {
    BUTTONS: { MODERATE, FALSE, TRUE },
  },
  platformType: { TELEGRAM },
} = require('../config');
const createMessageRequest = require('../utils/createMessageRequest');

function sendPhotoMessageTelegram({ message, photo, chatId }) {
  bot.telegram.sendPhoto(chatId, photo, {
    caption: message,
    parse_mode: 'HTML',
  });
}

function sendPhotoMessageToModerate({ request, moderatorId }) {
  bot.telegram.sendPhoto(moderatorId, request.photo, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: MODER_BUTTON.APPROVE,
            callback_data: `${MODERATE}:${request.reqId}${TRUE}`,
          },
        ],
        [
          {
            text: MODER_BUTTON.DECLINE,
            callback_data: `${MODERATE}:${request.reqId}${FALSE}`,
          },
        ],
      ],
    },
    caption: createMessageRequest(request, TELEGRAM),
    parse_mode: 'HTML',
  });
}

function sendMessageTelegram(id, message) {
  return bot.telegram.sendMessage(id, message);
}

function getFileLink(id) {
  return bot.telegram.getFileLink(id);
}

async function getNewPhotoId(url) {
  const photoId = await bot.telegram.sendPhoto(MODERATOR_GROUP_ID, url, {
    disable_notification: true,
  });
  bot.telegram.deleteMessage(MODERATOR_GROUP_ID, photoId.message_id);
  return photoId.photo[photoId.photo.length - 1].file_id;
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
  sendPhotoMessageTelegram,
  sendPhotoMessageToModerate,
  sendMessageTelegram,
  getFileLink,
  sendPhotoStream,
  getNewPhotoId,
};
