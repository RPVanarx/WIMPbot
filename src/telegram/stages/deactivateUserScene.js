const WizardScene = require('telegraf/scenes/wizard');
const {
    DEACTIVATE_USER_TRUE,
    DEACTIVATE_USER_FALSE,
    DEACTIVATE_USER_QUESTION,
    EVENT_SCENE_DEACTIVATE_USER,
    PLATFORM_TYPE_TELEGRAM,
} = require('../../config');
const { mainMenu, yesNoQuestion } = require('../menu');
const { changeUserActivity } = require('../../services');

const name = EVENT_SCENE_DEACTIVATE_USER;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(DEACTIVATE_USER_QUESTION, yesNoQuestion);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.update || !ctx.update.callback_query || ctx.update.callback_query.data === 'no') {
            ctx.reply(DEACTIVATE_USER_FALSE, mainMenu);
            return ctx.scene.leave();
        }
        try {
            await changeUserActivity(
                ctx.update.callback_query.from.id,
                PLATFORM_TYPE_TELEGRAM,
                false,
            );
            ctx.reply(DEACTIVATE_USER_TRUE, mainMenu);
        } catch (error) {
            ctx.reply(DEACTIVATE_USER_FALSE, mainMenu);
            console.log(`deleteUserScene ${error}`);
        }
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
