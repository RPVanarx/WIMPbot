const WizardScene = require('telegraf/scenes/wizard');
const Extra = require('telegraf/extra');
const menu = require('../menu');

const name = 'updateDate';

const scene = new WizardScene(
    name,
    (ctx) => {
        ctx.reply('Введіть ваші нові GPS координати', Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    markup.locationRequestButton('Відправити координати')
                ]);
        }));
        return ctx.wizard.next();
    },
    (ctx) => {
        if ('location' in ctx.message){
            ctx.reply('Ваші геоданні оновлено', menu);
            ctx.scene.leave();
        } 
        else { 
            ctx.reply('Щось пішло не так, натисніть на кнопку "Відправити координати" ще раз');
        }      
    });

module.exports = {
    name,
    scene
};