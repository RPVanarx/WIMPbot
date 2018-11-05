const WizardScene = require('telegraf/scenes/wizard');
const Extra = require('telegraf/extra');
const menu = require('../menu');

const name = 'createRequest';

const scene = new WizardScene(
    'name',
    (ctx) => {
        ctx.reply('Введіть фотографію загубленого домашньго улюбленця');
        return ctx.wizard.next();
    },
    (ctx) => {
        if ('photo' in ctx.message){
            ctx.reply(`Фото завантажено
                Відправте кординати пропажі`, Extra.markup((markup) => {
                return markup.resize()
                    .keyboard([
                        markup.locationRequestButton('Відправити координати')
                    ]);
            }) );
            return ctx.wizard.next();
        } else
        {
            ctx.reply('Щось пішло не так, відправте фото ще раз');
        }
        console.log(ctx.message);  
    },
    (ctx) => {
        if ('location' in ctx.message){
            ctx.reply(`Координати пропажі отримані
            Введіть невеликий опис улюбленця одним повідомленням`);
            return ctx.wizard.next();
        }
        else {
            ctx.reply('Щось пішло не так, натисніть на кнопку "Відправити координати" ще раз');
        }
    },
    (ctx) => {
        ctx.reply('Дякую, Ваша заявка надіслана модератору, після перевірки вона буде відправлена всім користувачам в радіусі 500м від пропажі', menu);
        return ctx.scene.leave(); 
    }
);

module.exports = {
    name,
    scene
};