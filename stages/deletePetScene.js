const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const { DELETE_PET_SCENE_MESSAGE /* DELETE_PET_SCENE_QUESTION */ } = require('../config');

const name = 'deletePetScene';
// let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(DELETE_PET_SCENE_MESSAGE);
        // go to logic to find user requests
        return ctx.wizard.next();
    },
    /* (ctx) => {
        if (ctx.message && ctx.message.text) {
            ctx.reply(DELETE_PET_SCENE_QUESTION);
            userMessage.description = ctx.message.text;
            userMessage = { id: 6 };
            userMessage.userId = ctx.message.from.id;
            return ctx.wizard.next();
        }
        return ctx.wizard.leave();
    }, */
    ctx => ctx.scene.leave()
    ,
);

module.exports = {
    name,
    scene,
};
