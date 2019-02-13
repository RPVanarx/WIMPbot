const WizardScene = require('telegraf/scenes/wizard');
const {
  DELETE_PET_SCENE_MESSAGE,
  EVENT_SCENE_DELETE_PET,
  PLATFORM_TYPE_TELEGRAM,
  REQUEST_CLOSE,
} = require('../../config');
const { userRequests } = require('../../services');
const { mainMenu } = require('../menu');

const name = EVENT_SCENE_DELETE_PET;

const scene = new WizardScene(name, async ctx => {
  try {
    const requests = await userRequests(ctx.update.callback_query.from.id, PLATFORM_TYPE_TELEGRAM);
    if (requests.length === 0) {
      ctx.reply(DELETE_PET_SCENE_MESSAGE, mainMenu);
      return ctx.scene.leave();
    }
    requests.forEach(req => {
      ctx.replyWithPhoto(req.photo, {
        reply_markup: {
          inline_keyboard: [[{ text: REQUEST_CLOSE, callback_data: `deleteRequest:${req.id}` }]],
        },
        caption: req.message,
      });
    });
    setTimeout(() => ctx.reply('Вибірка завершена', mainMenu), 2000);
  } catch (error) {
    console.log(`deletePetScene ${error}`);
  }
  return ctx.scene.leave();
});

module.exports = {
  name,
  scene,
};
