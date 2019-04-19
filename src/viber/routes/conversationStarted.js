const TextMessage = require('viber-bot').Message.Text;
const BotEvents = require('viber-bot').Events;
const keyboard = require('../menu');
const bot = require('../bot');

bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed) => {
  if (!isSubscribed) {
    bot.sendMessage(userProfile.userProfile, new TextMessage('hi', keyboard.registration));
  }
});
