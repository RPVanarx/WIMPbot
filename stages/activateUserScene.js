const WizardScene = require('telegraf/scenes/wizard');
const {
    ACTIVATE_USER_TRUE,
    ACTIVATE_USER_FALSE,
    ACTIVATE_USER_QUESTION,
    EVENT_SCENE_ACTIVATE_USER,
    PLATFORM_TYPE_TELEGRAM,
} = require('../config');
const { mainMenu, yesNoQuestion } = require('../menu');
const { changeUserActivity } = require('../services');

const name = EVENT_SCENE_ACTIVATE_USER;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(ACTIVATE_USER_QUESTION, yesNoQuestion);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.update || !ctx.update.callback_query || ctx.update.callback_query.data === 'no') {
            ctx.reply(ACTIVATE_USER_FALSE, mainMenu);
            return ctx.scene.leave();
        }
        try {
            if (await changeUserActivity(
                ctx.update.callback_query.from.id,
                PLATFORM_TYPE_TELEGRAM,
                true,
            )) {
                ctx.reply(ACTIVATE_USER_TRUE, mainMenu);
            }
        } catch (error) {
            console.log(`deleteUserScene ${error}`);
        }
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
