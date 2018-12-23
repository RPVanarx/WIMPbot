const WizardScene = require('telegraf/scenes/wizard');
const processing = require('../processing');

const name = 'changeLocation';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply('Введіть ваші нові GPS координати');
        userMessage = { id: 4 };
        return ctx.wizard.next();
    },
    (ctx) => {
        if ('location' in ctx.message) {
            userMessage.location = ctx.message.location;
        }
        userMessage.userId = ctx.message.from.id;
        processing(userMessage, ctx);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
