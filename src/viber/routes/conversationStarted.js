const TextMessage = require('viber-bot').Message.Text;
const BotEvents = require('viber-bot').Events;
const keyboard = require('../menu');
const bot = require('../bot');
const {
  localesUA: { WELCOME_MESSAGE, ALREADY_REGISTRATED },
  platformType: { VIBER },
} = require('../../config');
const { getUserStep, setUserStep } = require('../../services/user');

bot.on(BotEvents.CONVERSATION_STARTED, async (response, isSubscribed) => {
  if (isSubscribed) {
    return;
  }
  const userStep = await getUserStep({
    platformId: response.userProfile.id,
    platformType: VIBER,
  });
  if (userStep === undefined) {
    bot.sendMessage(response.userProfile, new TextMessage(WELCOME_MESSAGE, keyboard.registration));
    return;
  }
  await setUserStep({
    platformId: response.userProfile.id,
    platformType: VIBER,
    value: 1,
  });
  bot.sendMessage(response.userProfile, new TextMessage(ALREADY_REGISTRATED, keyboard.mainMenu));
});
