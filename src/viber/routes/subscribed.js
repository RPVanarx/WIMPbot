const BotEvents = require('viber-bot').Events;

const bot = require('../bot');
const {
  platformType: { VIBER },
} = require('../../config');
const { getUserId, changeUserActivity } = require('../../services/user');

bot.on(BotEvents.SUBSCRIBED, async response => {
  if (!(await getUserId({ platformId: response.userProfile.id, platformType: VIBER }))) {
    return;
  }
  await changeUserActivity({
    platformId: response.userProfile.id,
    platformType: VIBER,
    value: true,
  });
});
