const WizardScene = require('telegraf/scenes/wizard');
const processing = require('../processing');
const { DELETE_PET_SCENE_MESSAGE1 } = require('../config');

const name = 'deletePetScene';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(DELETE_PET_SCENE_MESSAGE1);
        userMessage = { id: 6 };
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply('Улюбленець знайшовся? (так, ні)');
        if ('text' in ctx.message) {
            userMessage.description = ctx.message.text;
        }
        userMessage.userId = ctx.message.from.id;
        return ctx.wizard.next();
    },
    (ctx) => {
        processing(userMessage, ctx);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
