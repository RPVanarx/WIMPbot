const WizardScene = require('telegraf/scenes/wizard');
const {
  CLOSE_OWN_REQUESTS_MESSAGES,
  EVENT_NAMES: { DELETE_REQUEST: name },
  PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { getUserRequests } = require('../../services');
const { mainMenu } = require('../menu');
const log = require('../../logger')(__filename);

const scene = new WizardScene(name, async ctx => {
  try {
    const requests = await getUserRequests({
      platformId: ctx.update.callback_query.from.id,
      platformType: PLATFORM_TYPE_TELEGRAM,
    });
    if (requests.length === 0) {
      ctx.reply(CLOSE_OWN_REQUESTS_MESSAGES.NO_REQUESTS, mainMenu);
      return ctx.scene.leave();
    }
    requests.forEach(req => {
      ctx.replyWithPhoto(req.photo, {
        reply_markup: {
          inline_keyboard: [
            [{ text: CLOSE_OWN_REQUESTS_MESSAGES.CLOSE, callback_data: `deleteRequest:${req.id}` }],
          ],
        },
        caption: req.message,
      });
    });
    setTimeout(
      () => ctx.reply(CLOSE_OWN_REQUESTS_MESSAGES.SAMPLE_END, mainMenu),
      CLOSE_OWN_REQUESTS_MESSAGES.TIMEOUT,
    );
  } catch (error) {
    log.error({ err: error.message }, 'closeOwnRequest');
  }
  return ctx.scene.leave();
});

module.exports = {
  name,
  scene,
};
