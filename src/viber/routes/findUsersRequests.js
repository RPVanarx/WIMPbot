const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  PLATFORM_TYPE_VIBER,
  FIND_REQUESTS_MESSAGES: { QUESTION_LOCATION },
} = require('../../config');
const { getUserStep, setUserStep } = require('../../services');
const log = require('../../logger')(__filename);

bot.onTextMessage(/findUsersRequests/, async (message, response) => {
  try {
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
      })) !== 1
    ) {
      badRequest(response.userProfile);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 11,
    });
    bot.sendMessage(
      response.userProfile,
      new TextMessage(QUESTION_LOCATION, keyboard.locationChoise),
    );
  } catch (error) {
    log.error({ err: error }, 'findUsersRequests viber');
    badRequest(response.userProfile);
  }
});
