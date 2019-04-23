const TextMessage = require('viber-bot').Message.Text;
const bot = require('../bot');
const {
  localesUA: {
    REGISTRATION_MESSAGES: { CREATE },
  },
} = require('../../config');

bot.onTextMessage(/registrateUser/, (message, response) => {
  bot.sendMessage(response.userProfile, new TextMessage(CREATE));
});
