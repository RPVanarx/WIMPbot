const TextMessage = require('viber-bot').Message.Text;
const PictureMessage = require('viber-bot').Message.Picture;
const bot = require('../bot');
const {
  localesUA: {
    REGISTRATION_MESSAGES: { CREATE },
  },
  viberEvents: { REGISTRATE_USER },
  defaultValues: { VIBER_HELP_PHOTO },
} = require('../../config');

bot.onTextMessage(REGISTRATE_USER, async (message, response) => {
  bot.sendMessage(response.userProfile, new TextMessage(CREATE));
  bot.sendMessage(response.userProfile, new PictureMessage(VIBER_HELP_PHOTO));
});
