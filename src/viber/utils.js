const TextMessage = require('viber-bot').Message.Text;
const PictureMessage = require('viber-bot').Message.Picture;
const bot = require('./bot');
const {
  localesUA: {
    CREATE_MESSAGE_TEXTS: { REQUEST },
  },
} = require('../config');
const getCurrentKeyboard = require('./getCurrentKeyboard');

async function sendPhotoMessageViber({ chatId, message, requestId, photo }) {
  const keyboard = await getCurrentKeyboard(chatId);
  bot.sendMessage({ id: chatId }, [
    new PictureMessage(photo, `${REQUEST}${requestId}`),
    new TextMessage(message),
    keyboard,
  ]);
}

function sendOwnMessage({ chatId, message, requestId, photo }) {
  bot.sendMessage({ id: chatId }, [
    new PictureMessage(photo, `${REQUEST}${requestId}`),
    new TextMessage(message),
  ]);
}

async function sendMessageViber(platformId, message) {
  const keyboard = await getCurrentKeyboard(platformId);
  bot.sendMessage({ id: platformId }, [new TextMessage(message), keyboard]);
}

module.exports = { sendPhotoMessageViber, sendMessageViber, sendOwnMessage };
