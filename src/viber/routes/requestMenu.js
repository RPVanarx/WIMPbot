const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  platformType: { VIBER },
  localesUA: { REQUEST_MENU_MESSAGE },
  viberEvents: { REQUEST_MENU },
} = require('../../config');
const { getUserStep, setUserStep } = require('../../services/user');
const log = require('../../logger')(__filename);

bot.onTextMessage(REQUEST_MENU, async (message, response) => {
  try {
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
      })) !== 1
    ) {
      badRequest(response.userProfile);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: 4,
    });
    bot.sendMessage(
      response.userProfile,
      new TextMessage(REQUEST_MENU_MESSAGE, keyboard.requestMenu),
    );
  } catch (error) {
    log.error({ err: error }, 'requestMenu viber');
    badRequest(response.userProfile);
  }
});
