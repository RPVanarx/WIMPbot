const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const { PLATFORM_TYPE_VIBER } = require('../../config');
const { getUserStep, setUserStep } = require('../../services');

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
    bot.sendMessage(
      response.userProfile,
      new TextMessage(
        'Вкл гпс і використовуючи функцію месенджера відправте координати',
        keyboard.backMainMenu,
      ),
    );
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
