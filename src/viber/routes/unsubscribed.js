const BotEvents = require('viber-bot').Events;

const bot = require('../bot');
const {
  platformType: { VIBER },
} = require('../../config');
const { getUserId, changeUserActivity } = require('../../services/user');

bot.on(BotEvents.UNSUBSCRIBED, async userId => {
  if (!(await getUserId({ platformId: userId, platformType: VIBER }))) {
    return;
  }
  await changeUserActivity({ platformId: userId, platformType: VIBER, value: false });
});
