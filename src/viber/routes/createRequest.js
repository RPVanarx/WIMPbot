const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  platformType: { VIBER },
  localesUA: {
    VIBER_TELEPHONE,
    CREATE_REQUEST_MESSAGES: { MANY_BAD_REQUESTS, CHOICE_TYPE },
  },
} = require('../../config');
const {
  getUserStep,
  setUserStep,
  getUserName,
  canUserCreateRequest,
} = require('../../services/user');
const usersRequestBase = require('../usersRequestBase');
const log = require('../../logger')(__filename);

bot.onTextMessage(/createRequest/, async (message, response) => {
  try {
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
      })) !== 4
    ) {
      badRequest(response.userProfile);
      return;
    }
    const phoneNumber = await getUserName({
      platformId: response.userProfile.id,
      platformType: VIBER,
    });
    if (!phoneNumber) {
      await setUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
        value: 5,
      });
      bot.sendMessage(response.userProfile, [
        new TextMessage(VIBER_TELEPHONE.NUMBER),
        keyboard.phoneShare,
      ]);
      return;
    }
    const status = await canUserCreateRequest({
      platformId: response.userProfile.id,
      platformType: VIBER,
    });
    if (!status) {
      badRequest(response.userProfile, MANY_BAD_REQUESTS);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: 6,
    });
    usersRequestBase.set(response.userProfile.id, { userName: phoneNumber });
    bot.sendMessage(response.userProfile, new TextMessage(CHOICE_TYPE, keyboard.searchFoundMenu));
  } catch (error) {
    log.error({ err: error }, 'createRequest viber');
    badRequest(response.userProfile);
  }
});
