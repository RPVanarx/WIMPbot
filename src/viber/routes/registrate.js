const TextMessage = require('viber-bot').Message.Text;
const bot = require('../bot');
const {
  localesUA: {
    REGISTRATION_MESSAGES: { CREATE },
  },
  viberEvents: { REGISTRATE_USER },
} = require('../../config');

bot.onTextMessage(REGISTRATE_USER, async (message, response) => {
  bot.sendMessage(response.userProfile, new TextMessage(CREATE));
});
