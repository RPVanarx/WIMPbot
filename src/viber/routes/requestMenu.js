const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const { PLATFORM_TYPE_VIBER } = require('../../config');
const { getUserStep, setUserStep } = require('../../services');

bot.onTextMessage(/requestMenu/, async (message, response) => {
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
      value: 4,
    });
    bot.sendMessage(
      response.userProfile,
      new TextMessage('Ви в меню подачі заявки', keyboard.requestMenu),
    );
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
