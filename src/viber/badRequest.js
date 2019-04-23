const TextMessage = require('viber-bot').Message.Text;
const bot = require('./bot');
const keyboard = require('./menu');
const { setUserStep } = require('../services');
const {
  platformType: { VIBER },
  localesUA: { VIBER_BAD_REQUEST },
} = require('../config');

const badRequest = async (userProfile, message = VIBER_BAD_REQUEST) => {
  await setUserStep({
    platformId: userProfile.id,
    platformType: VIBER,
    value: 1,
  });
  bot.sendMessage(userProfile, new TextMessage(message, keyboard.mainMenu));
};

module.exports = badRequest;
