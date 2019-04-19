const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const { PLATFORM_TYPE_VIBER } = require('../../config');
const { getUserStep, setUserStep, getUserRequests } = require('../../services');
const { sendOwnMessage } = require('../utils');

bot.onTextMessage(/closeOwnRequest/, async (message, response) => {
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
    const requests = await getUserRequests({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
    });
    if (requests.length === 0) {
      await setUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
        value: 1,
      });
      bot.sendMessage(
        response.userProfile,
        new TextMessage('Ви не маєте активних заявок', keyboard.mainMenu),
      );
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
      value: 10,
    });
    requests.forEach((req, i) => {
      req.user_name = 'Ви';
      const photoURL =
        'https://dl-media.viber.com/1/share/2/long/vibes/icon/image/0x0/1433/673465886be1a0cabc915dad06fa14f71b6f80496ca0943dea5b85a4f54a1433.jpg';
      // doPhotoURL(req.photo);
      setTimeout(
        () =>
          sendOwnMessage({
            chatId: response.userProfile.id,
            photo: photoURL,
            request: req,
          }),
        1000 * i,
      );
    });
    setTimeout(
      () => bot.sendMessage(response.userProfile, keyboard.deleteRequestButtons(requests)),
      1000 * requests.length + 1000,
    );
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
