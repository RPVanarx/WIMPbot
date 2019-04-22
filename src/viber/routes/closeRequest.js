const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const { PLATFORM_TYPE_VIBER, VIBER_REQUEST_CLOSE } = require('../../config');
const {
  getUserStep,
  getUserRequests,
  getPlatformIdFromRequest,
  deleteRequest,
} = require('../../services');

bot.onTextMessage(/closeRequest/, async (message, response) => {
  try {
    const requestId = Number.parseInt(message.text.split(':')[1], 10);
    const userIdFromRequest = await getPlatformIdFromRequest(requestId);
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: PLATFORM_TYPE_VIBER,
      })) !== 10 ||
      userIdFromRequest !== response.userProfile.id
    ) {
      badRequest(response.userProfile);
      return;
    }
    await deleteRequest(requestId);
    const requests = await getUserRequests({
      platformId: response.userProfile.id,
      platformType: PLATFORM_TYPE_VIBER,
    });
    bot.sendMessage(response.userProfile, [
      new TextMessage(
        `${VIBER_REQUEST_CLOSE.REQUEST} ${requestId} ${VIBER_REQUEST_CLOSE.CLOSE}`,
        keyboard.deleteRequestButtons(requests),
      ),
    ]);
  } catch (error) {
    console.log(error);
    badRequest(response.userProfile);
  }
});
