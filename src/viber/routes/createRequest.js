const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const { PLATFORM_TYPE_VIBER } = require('../../config');
const { getUserStep, setUserStep, getUserName, isUserCanCreateRequest } = require('../../services');
const usersRequestBase = require('../usersRequestBase');

bot.onTextMessage(/createRequest/, async (message, response) => {
  try {
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
      })) !== 4
    ) {
      badRequest(response.userProfile);
      return;
    }
    const phoneNumber = await getUserName({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
    });
    if (!phoneNumber) {
      await setUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
        value: 5,
      });
      bot.sendMessage(response.userProfile, [
        new TextMessage(
          'Для створення заявки необхідно надати свій номер мобільного, інакше юзери не зможуть вам відповісти ',
        ),
        keyboard.phoneShare,
      ]);
      return;
    }
    const status = await isUserCanCreateRequest({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
    });
    if (!status) {
      badRequest(response.userProfile, 'Перевищено ліміт непідтверджених заявок');
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 6,
    });
    usersRequestBase.set(response.userProfile.id, { userName: phoneNumber });
    bot.sendMessage(
      response.userProfile,
      new TextMessage(
        'Ваш улюбленець загубився, чи ви знайшли чийогось?',
        keyboard.searchFoundMenu,
      ),
    );
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
