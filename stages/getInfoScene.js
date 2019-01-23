const WizardScene = require('telegraf/scenes/wizard');

const {
    GET_INFO_SCENE_RADIUS_MESSAGE,
    EVENT_SCENE_GET_INFO,
    GET_INFO_SCENE_DAYS_MESSAGE,
    SEARCH_PET_SCENE_ERROR,
} = require('../config');

const { mainMenu } = require('../menu');

const name = EVENT_SCENE_GET_INFO;
const { getRequests } = require('../services');

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(GET_INFO_SCENE_RADIUS_MESSAGE);
        ctx.session.userMessage = {};
        return ctx.wizard.next();
    },
    (ctx) => {
        if (!ctx.message
            || !ctx.message.text
            || Number.isNaN(Number.parseInt(ctx.message.text, 10))) {
            ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
            delete ctx.session.userMessage;
            return ctx.scene.leave();
        }
        ctx.session.userMessage.newRadius = Number.parseInt(ctx.message.text, 10);
        ctx.reply(GET_INFO_SCENE_DAYS_MESSAGE);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message
            || !ctx.message.text
            || Number.isNaN(Number.parseInt(ctx.message.text, 10))) {
            ctx.reply(SEARCH_PET_SCENE_ERROR, mainMenu);
            delete ctx.session.userMessage;
            return ctx.scene.leave();
        }
        try {
            await getRequests(
                ctx.message.from.id,
                ctx.session.userMessage.newRadius,
                Number.parseInt(ctx.message.text, 10),
            );
        } catch (error) {
            console.log(`getInfoScene ${error}`);
        }
        ctx.reply('Message send', mainMenu);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
