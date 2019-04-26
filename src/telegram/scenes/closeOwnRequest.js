const WizardScene = require('telegraf/scenes/wizard');
const {
  localesUA: { CLOSE_OWN_REQUESTS_MESSAGES },
  telegramEvents: {
    SCENES: { DELETE_REQUEST: name },
    BUTTONS: { DELETE_REQUEST },
  },
  platformType: { TELEGRAM },
  defaultValues: { TIMEOUT_TELEGRAM_SAMPLE },
} = require('../../config');
const { getUserRequests } = require('../../services/request');
const { mainMenu } = require('../menu');
const log = require('../../logger')(__filename);

const scene = new WizardScene(name, async ctx => {
  try {
    const requests = await getUserRequests({
      platformId: ctx.update.callback_query.from.id,
      platformType: TELEGRAM,
    });
    if (requests.length === 0) {
      ctx.reply(CLOSE_OWN_REQUESTS_MESSAGES.NO_REQUESTS, mainMenu);
      return ctx.scene.leave();
    }
    requests.forEach(req => {
      ctx.replyWithPhoto(req.photo, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: CLOSE_OWN_REQUESTS_MESSAGES.CLOSE,
                callback_data: `${DELETE_REQUEST}:${req.id}`,
              },
            ],
          ],
        },
        caption: req.message,
      });
    });
    setTimeout(
      () => ctx.reply(CLOSE_OWN_REQUESTS_MESSAGES.SAMPLE_END, mainMenu),
      TIMEOUT_TELEGRAM_SAMPLE,
    );
  } catch (error) {
    log.error({ err: error }, 'closeOwnRequest');
  }
  return ctx.scene.leave();
});

module.exports = {
  name,
  scene,
};
