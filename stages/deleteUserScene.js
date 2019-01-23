const WizardScene = require('telegraf/scenes/wizard');
const {
    DELETE_USER_TRUE,
    DELETE_USER_FALSE,
    DELETE_USER_QUESTION,
    EVENT_SCENE_DELETE_USER,
    PLATFORM_TYPE_TELEGRAM,
} = require('../config');
const { mainMenu, yesNoQuestion } = require('../menu');
const { deleteUser } = require('../services');

const name = EVENT_SCENE_DELETE_USER;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(DELETE_USER_QUESTION, yesNoQuestion);
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (ctx.update.callback_query.data !== 'yes') {
            ctx.reply(DELETE_USER_FALSE, mainMenu);
            return ctx.scene.leave();
        }
        try {
            if (await deleteUser(
                ctx.update.callback_query.from.id,
                PLATFORM_TYPE_TELEGRAM,
            )) {
                ctx.reply(DELETE_USER_TRUE, mainMenu);
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
