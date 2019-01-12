const WizardScene = require('telegraf/scenes/wizard');
// const processing = require('../processing');
const {
    GET_INFO_SCENE_RADIUS_MESSAGE,
    EVENT_SCENE_GET_INFO,
    GET_INFO_SCENE_DAYS_MESSAGE,
    SEARCH_PET_SCENE_ERROR,
} = require('../config');

const { mainMenu } = ('../menu');
const name = EVENT_SCENE_GET_INFO;
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(GET_INFO_SCENE_RADIUS_MESSAGE);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message && ctx.message.text) {
            ctx.reply(GET_INFO_SCENE_DAYS_MESSAGE);
            userMessage = { id: 7 };
            userMessage.radius = ctx.message.text;
            return ctx.wizard.next();
        }
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        return ctx.scene.leave();
    },
    (ctx) => {
        if (ctx.message && ctx.message.text) {
            userMessage.days = ctx.message.text;
            userMessage.userId = ctx.message.from.id;
            // send usermessage to logic
            return ctx.scene.leave();
        }
        // processing(userMessage, ctx);
        ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
