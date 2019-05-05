const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  platformType: { VIBER },
  localesUA: {
    CREATE_REQUEST_MESSAGES: { PHOTO },
  },
  viberEvents: { REQUEST_TYPE },
} = require('../../config');
const { getUserStep, setUserStep } = require('../../services/user');
const usersRequestBase = require('../usersRequestBase');
const log = require('../../logger')(__filename);

bot.onTextMessage(REQUEST_TYPE, async (message, response) => {
  try {
    const type = message.text.split(':')[1];
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
      })) !== 6 ||
      !['search', 'found'].includes(type)
    ) {
      badRequest(response.userProfile);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: 7,
    });
    usersRequestBase.get(response.userProfile.id).requestType = type;
    bot.sendMessage(response.userProfile, new TextMessage(PHOTO, keyboard.backMainMenu));
  } catch (error) {
    log.error({ err: error }, 'requestType viber');
    badRequest(response.userProfile.id);
  }
});
