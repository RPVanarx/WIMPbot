const WizardScene = require('telegraf/scenes/wizard');
const processing = require('../processing');

const name = 'deleteUser';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply('Ви впевнені що бажаєте видалитися із системи? (напишіть так чи ні)');
        userMessage = { id: 5 };
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text === 'так') {
            userMessage.answer = true;
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
