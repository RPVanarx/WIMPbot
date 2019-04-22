const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  PLATFORM_TYPE_VIBER,
  FIND_REQUESTS_MESSAGES: { LOCATION, RADIUS, CB_NEW_LOCATION, CB_REGISTRATE_LOCATION },
} = require('../../config');
const { getUserStep, setUserStep, getUserLocation } = require('../../services');
const usersRequestBase = require('../usersRequestBase');

bot.onTextMessage(/locationChoise/, async (message, response) => {
  try {
    const choise = message.text.split(':')[1];
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
      })) !== 11 ||
      ![CB_REGISTRATE_LOCATION, CB_NEW_LOCATION].includes(choise)
    ) {
      badRequest(response.userProfile);
      return;
    }
    usersRequestBase.set(response.userProfile.id, {});
    if (choise === CB_NEW_LOCATION) {
      await setUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
        value: 12,
      });
      bot.sendMessage(response.userProfile, new TextMessage(LOCATION, keyboard.backMainMenu));
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 13,
    });
    const location = await getUserLocation({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
    });
    usersRequestBase.get(response.userProfile.id).latitude = location.y;
    usersRequestBase.get(response.userProfile.id).longitude = location.x;
    bot.sendMessage(response.userProfile, new TextMessage(RADIUS, keyboard.backMainMenu));
    return;
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
