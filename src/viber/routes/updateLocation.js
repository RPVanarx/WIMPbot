const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  PLATFORM_TYPE_VIBER,
  UPDATE_LOCATION_MESSAGES: { UPDATE },
} = require('../../config');
const { getUserStep, setUserStep } = require('../../services');
const log = require('../../logger')(__filename);

bot.onTextMessage(/updateLocation/, async (message, response) => {
  try {
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
      })) !== 2
    ) {
      badRequest(response.userProfile);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 3,
    });
    bot.sendMessage(response.userProfile, new TextMessage(UPDATE, keyboard.backMainMenu));
  } catch (error) {
    log.error({ err: error }, 'updateLocation viber');
    badRequest(response.userProfile);
  }
});
