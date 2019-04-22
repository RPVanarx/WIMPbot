const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  PLATFORM_TYPE_VIBER,
  CREATE_REQUEST_MESSAGES: { PHOTO },
} = require('../../config');
const { getUserStep, setUserStep } = require('../../services');
const usersRequestBase = require('../usersRequestBase');

bot.onTextMessage(/requestType/, async (message, response) => {
  try {
    const type = message.text.split(':')[1];
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
      })) !== 6 ||
      !['search', 'found'].includes(type)
    ) {
      badRequest(response.userProfile);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 7,
    });
    usersRequestBase.get(response.userProfile.id).requestType = type;
    bot.sendMessage(response.userProfile, new TextMessage(PHOTO, keyboard.backMainMenu));
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile.id);
  }
});
