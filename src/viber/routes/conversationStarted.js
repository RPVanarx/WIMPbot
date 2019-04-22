const TextMessage = require('viber-bot').Message.Text;
const BotEvents = require('viber-bot').Events;
const keyboard = require('../menu');
const bot = require('../bot');
const { WELCOME_MESSAGE } = require('../../config');

bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed) => {
  if (!isSubscribed) {
    bot.sendMessage(
      userProfile.userProfile,
      new TextMessage(WELCOME_MESSAGE, keyboard.registration),
    );
  }
});
