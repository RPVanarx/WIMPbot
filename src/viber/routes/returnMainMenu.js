const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const { PLATFORM_TYPE_VIBER } = require('../../config');
const { setUserStep } = require('../../services');
const badRequest = require('../badRequest');

bot.onTextMessage(/returnMainMenu/, async (message, response) => {
  try {
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 1,
    });
    bot.sendMessage(
      response.userProfile,
      new TextMessage('Ви повернулися в головне меню', keyboard.mainMenu),
    );
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile.id);
  }
});
