const WizardScene = require('telegraf/scenes/wizard');
const menu = require('../menu');

const name = 'getInfo';

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply(`В якому радіусі від ваших координат відібрати повідомлення пошуку?
            Введіть числове значення в метрах (приклад 2км = 2000)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply(`На скільки старі повідомлення ви хочете відібрати?
            Введіть числове значення в днях (приклад пошукові повідомлення які були подані протягом останніх 2-х місяців - 60)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply('Ваша заявка отримана, зараз ви отримаєте повідомлення на пошук всіх тварин що попали під ваш критерій запиту.');
        ctx.reply('Вибірка завершена', menu); 
        return ctx.scene.leave();
    }  
);

module.exports = {
    name,
    scene
};