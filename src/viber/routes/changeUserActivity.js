const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const { PLATFORM_TYPE_VIBER, DEACTIVATE_USER, ACTIVATE_USER } = require('../../config');
const { getUserStep, setUserStep, changeUserActivity } = require('../../services');

bot.onTextMessage(/changeUserActivity/, async (message, response) => {
  try {
    const status = message.text.split(':')[1];
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
      })) !== 2 ||
      !['true', 'false'].includes(status)
    ) {
      badRequest(response.userProfile);
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 1,
    });
    await changeUserActivity({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: status,
    });
    const answerMessage = JSON.parse(status) ? ACTIVATE_USER.TRUE : DEACTIVATE_USER.TRUE;
    bot.sendMessage(response.userProfile, new TextMessage(answerMessage, keyboard.mainMenu));
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
