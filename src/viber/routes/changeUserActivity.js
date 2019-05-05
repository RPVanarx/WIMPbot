const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  platformType: { VIBER },
  localesUA: { DEACTIVATE_USER, ACTIVATE_USER },
  viberEvents: { TRUE, FALSE, CHANGE_USER_ACTIVITY },
} = require('../../config');
const { getUserStep, setUserStep, changeUserActivity } = require('../../services/user');
const log = require('../../logger')(__filename);

bot.onTextMessage(CHANGE_USER_ACTIVITY, async (message, response) => {
  try {
    const status = message.text.split(':')[1];
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
      })) !== 2 ||
      ![TRUE, FALSE].includes(status)
    ) {
      badRequest(response.userProfile);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: 1,
    });
    await changeUserActivity({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: status,
    });
    const answerMessage = JSON.parse(status) ? ACTIVATE_USER.TRUE : DEACTIVATE_USER.TRUE;
    bot.sendMessage(response.userProfile, new TextMessage(answerMessage, keyboard.mainMenu));
  } catch (error) {
    log.error({ err: error }, 'changeUserActivity viber');
    badRequest(response.userProfile);
  }
});
