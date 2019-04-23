const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  platformType: { VIBER },
  localesUA: {
    FIND_REQUESTS_MESSAGES: { LOCATION, RADIUS },
  },
  viberEvents: {
    BUTTONS: { NEW_LOCATION, REGISTRATE_LOCATION },
  },
} = require('../../config');
const { getUserStep, setUserStep, getUserLocation } = require('../../services');
const usersRequestBase = require('../usersRequestBase');
const log = require('../../logger')(__filename);

bot.onTextMessage(/locationChoise/, async (message, response) => {
  try {
    const choise = message.text.split(':')[1];
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
      })) !== 11 ||
      ![REGISTRATE_LOCATION, NEW_LOCATION].includes(choise)
    ) {
      badRequest(response.userProfile);
      return;
    }
    usersRequestBase.set(response.userProfile.id, {});
    if (choise === NEW_LOCATION) {
      await setUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
        value: 12,
      });
      bot.sendMessage(response.userProfile, new TextMessage(LOCATION, keyboard.backMainMenu));
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: 13,
    });
    const location = await getUserLocation({
      platformId: response.userProfile.id,
      platformType: VIBER,
    });
    usersRequestBase.get(response.userProfile.id).latitude = location.y;
    usersRequestBase.get(response.userProfile.id).longitude = location.x;
    bot.sendMessage(response.userProfile, new TextMessage(RADIUS, keyboard.backMainMenu));
    return;
  } catch (error) {
    log.error({ err: error }, 'locationChoise viber');
    badRequest(response.userProfile);
  }
});
