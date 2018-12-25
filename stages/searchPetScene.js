const WizardScene = require('telegraf/scenes/wizard');
const processing = require('../processing');

const name = 'searchPetScene';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply('Завантажте фотографію загубленого домашньго улюбленця');
        userMessage = { id: 4 };
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply('Завантажте місце де улюбленець загубився');
        if ('photo' in ctx.message) {
            userMessage.photo = ctx.message.photo[ctx.message.photo.length - 1];
        }
        userMessage.userId = ctx.message.from.id;
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply('Введіть невеликий опис улюбленця одним повідомленням');
        if ('location' in ctx.message) {
            userMessage.location = ctx.message.location;
        }
        return ctx.wizard.next();
    },
    (ctx) => {
        if ('text' in ctx.message) {
            userMessage.description = ctx.message.text;
        }
        processing(userMessage, ctx);
        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
