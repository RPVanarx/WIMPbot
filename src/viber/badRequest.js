const TextMessage = require('viber-bot').Message.Text;
const bot = require('./bot');
const keyboard = require('./menu');
const { setUserStep } = require('../services');
const { PLATFORM_TYPE_VIBER } = require('../config');

const badRequest = async (
  userProfile,
  message = 'Щось пішло не так, ви повернуті до головного меню',
) => {
  await setUserStep({
    platformId: userProfile.id,
    platformType: PLATFORM_TYPE_VIBER,
    value: 1,
  });
  bot.sendMessage(userProfile, new TextMessage(message, keyboard.mainMenu));
};

module.exports = badRequest;
