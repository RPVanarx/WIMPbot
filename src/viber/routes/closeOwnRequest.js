const TextMessage = require('viber-bot').Message.Text;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  platformType: { VIBER },
  localesUA: {
    CLOSE_OWN_REQUESTS_MESSAGES: { NO_REQUESTS },
    YOU,
  },
} = require('../../config');
const {
  getUserStep,
  setUserStep,
  getUserRequests,
  getFileLink,
  createMessageRequest,
} = require('../../services');
const { sendOwnMessage } = require('../utils');
const log = require('../../logger')(__filename);

bot.onTextMessage(/closeOwnRequest/, async (message, response) => {
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
    const requests = await getUserRequests({
      platformId: response.userProfile.id,
      platformType: VIBER,
    });
    if (requests.length === 0) {
      await setUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
        value: 1,
      });
      bot.sendMessage(response.userProfile, new TextMessage(NO_REQUESTS, keyboard.mainMenu));
      return;
    }
    await setUserStep({
      platformId: response.userProfile.id,
      platformType: VIBER,
      value: 10,
    });
    requests.forEach(async (req, i) => {
      req.user_name = YOU;
      const photoURL = await getFileLink(req.photo);
      setTimeout(() => {
        const createMessage = createMessageRequest(
          {
            platformType: VIBER,
            requestType: req.request_type,
            userName: req.user_name,
            creationDate: req.creation_date,
            message: req.message,
            latitude: req.location.y,
            longitude: req.location.x,
            id: req.id,
          },
          VIBER,
        );
        sendOwnMessage({
          chatId: response.userProfile.id,
          photo: photoURL,
          requestId: req.id,
          message: createMessage,
        });
      }, 1000 * i);
    });
    setTimeout(
      () =>
        bot.sendMessage(
          response.userProfile,
          new KeyboardMessage(keyboard.deleteRequestButtons(requests)),
        ),
      1000 * requests.length + 1000,
    );
  } catch (error) {
    log.error({ err: error }, 'closeOwnRequest viber');
    badRequest(response.userProfile);
  }
});
