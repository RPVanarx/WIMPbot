const WizardScene = require('telegraf/scenes/wizard');
const processing = require('../processing');

const name = 'getInfo';
let userMessage;

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(`В якому радіусі від ваших координат відібрати повідомлення пошуку?
            Введіть числове значення в метрах (приклад 2км = 2000)`);
        userMessage = { id: 3 };
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply(`На скільки старі повідомлення ви хочете відібрати?
            Введіть числове значення в днях (приклад пошукові повідомлення які були подані протягом останніх 2-х місяців - 60)`);
        if ('text' in ctx.message) {
            userMessage.radius = ctx.message.text;
        }
        userMessage.userId = ctx.message.from.id;
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply('Ваша заявка отримана, очікуйте відповіді.');
        if ('text' in ctx.message) {
            userMessage.days = ctx.message.text;
        }
        processing(userMessage, ctx);

        return ctx.scene.leave();
    },
);

module.exports = {
    name,
    scene,
};
