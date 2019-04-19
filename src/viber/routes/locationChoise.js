const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const { PLATFORM_TYPE_VIBER } = require('../../config');
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
      !['registrLocation', 'newLocation'].includes(choise)
    ) {
      badRequest(response.userProfile);
      return;
    }
    usersRequestBase.set(response.userProfile.id, {});
    if (choise === 'newLocation') {
      await setUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
        value: 12,
      });
      bot.sendMessage(
        response.userProfile,
        new TextMessage(
          'Включіть гпс та введіть координати по яким бажаєте зробити вибірку',
          keyboard.backMainMenu,
        ),
      );
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
    bot.sendMessage(
      response.userProfile,
      new TextMessage('Введіть радіус вибірки в метрах', keyboard.backMainMenu),
    );
    return;
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
