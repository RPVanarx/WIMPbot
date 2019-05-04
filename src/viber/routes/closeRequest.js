const TextMessage = require('viber-bot').Message.Text;
const keyboard = require('../menu');
const bot = require('../bot');
const badRequest = require('../badRequest');
const {
  platformType: { VIBER },
  localesUA: { VIBER_REQUEST_CLOSE },
} = require('../../config');
const {
  user: { getUserStep, getRequestOwner },
  request: { getUserRequests, deleteRequest },
} = require('../../services');
const log = require('../../logger')(__filename);

bot.onTextMessage(/closeRequest/, async (message, response) => {
  try {
    const requestId = Number.parseInt(message.text.split(':')[1], 10);
    const { platformId: userIdFromRequest } = await getRequestOwner(requestId);
    if (
      (await getUserStep({
        platformId: response.userProfile.id,
        platformType: VIBER,
      })) !== 10 ||
      userIdFromRequest !== response.userProfile.id
    ) {
      badRequest(response.userProfile);
      return;
    }
    await deleteRequest(requestId);
    const requests = await getUserRequests({
      platformId: response.userProfile.id,
      platformType: VIBER,
    });
    bot.sendMessage(response.userProfile, [
      new TextMessage(
        `${VIBER_REQUEST_CLOSE.REQUEST} ${requestId} ${VIBER_REQUEST_CLOSE.CLOSE}`,
        keyboard.deleteRequestButtons(requests),
      ),
    ]);
  } catch (error) {
    log.error({ err: error }, 'closeRequest viber');
    badRequest(response.userProfile);
  }
});
