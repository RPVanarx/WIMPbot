const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const {
  platformType: { VIBER },
  localesUA: { VIBER_BACK_MAIN_MENU },
} = require('../../config');
const { setUserStep } = require('../../services/user');
const badRequest = require('../badRequest');
const log = require('../../logger')(__filename);

bot.onTextMessage(/returnMainMenu/, async (message, response) => {
  try {
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: 1,
    });
    bot.sendMessage(response.userProfile, new TextMessage(VIBER_BACK_MAIN_MENU, keyboard.mainMenu));
  } catch (error) {
    log.error({ err: error }, 'returnMainMenu viber');
    badRequest(response.userProfile.id);
  }
});
