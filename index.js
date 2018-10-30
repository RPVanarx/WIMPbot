const Telegraf = require('telegraf');
const config = require('./config.json');
const bot = new Telegraf(config.token);
const Extra = require('telegraf/extra');
const Composer = require('telegraf/composer');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');
const stage = new Stage();

const updateData = new WizardScene(
    "updateData",
    (ctx) => {
        ctx.reply('Введіть ваші нові GPS координати', Extra.markup((markup) => {
            return markup.resize()
              .keyboard([
                  markup.locationRequestButton('Відправити координати')
              ])
          }));
        return ctx.wizard.next();
    },
    (ctx) => {
        if ('location' in ctx.message){
            ctx.reply('Ваші геоданні оновлено', Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                [m.callbackButton('Оновити свої gps координати', 'updateData')],
                [m.callbackButton('Подати заявку на пошук', 'createApp')],
                [m.callbackButton('Отримати інфо про пошук тварин','getInfo')]
               ])));
            ctx.scene.leave();
        } 
        else { 
            ctx.reply('Щось пішло не так, натисніть на кнопку "Відправити координати" ще раз');
            }      
    });

    const createApp = new WizardScene(
    'createApp',
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
                  ])
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
            ctx.reply('Координати пропажі отримані');
            ctx.reply('Введіть невеликий опис улюбленця одним повідомленням');
            return ctx.wizard.next();
        }
        else {
            ctx.reply('Щось пішло не так, натисніть на кнопку "Відправити координати" ще раз');
        }
    },
    (ctx) => {
        ctx.reply('Дякую, Ваша заявка надіслана модератору, після перевірки вона буде відправлена всім користувачам в радіусі 500м від пропажі', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            [m.callbackButton('Оновити свої gps координати', 'updateData')],
            [m.callbackButton('Подати заявку на пошук', 'createApp')],
            [m.callbackButton('Отримати інфо про пошук тварин','getInfo')]
           ])));
        return ctx.scene.leave();
    }
);

const getInfo = new WizardScene(
    'getInfo',
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
        ctx.reply('Ваша заявка отримана, зараз ви отримаєте повідомлення на пошук всіх тварин що попали під ваш критерій запиту.')
        ctx.reply('Вибірка завершена',Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            [m.callbackButton('Оновити свої gps координати', 'updateData')],
            [m.callbackButton('Подати заявку на пошук', 'createApp')],
            [m.callbackButton('Отримати інфо про пошук тварин','getInfo')]
           ]))); 
        return ctx.scene.leave();
    }  
);

stage.register(updateData);
stage.register(createApp);
stage.register(getInfo);
bot.use(session());
bot.use(stage.middleware());
bot.action('updateData', (ctx) => ctx.scene.enter('updateData'));
bot.action('createApp', (ctx) => ctx.scene.enter('createApp'));
bot.action('getInfo', (ctx) => ctx.scene.enter('getInfo'));


bot.start((ctx) => {
    ctx.reply('Вітаю, Ви завітали до WIMP бота, для початку роботи зі мною введіть Ваші геолокаційні дані');
    return ctx.reply('Включіть GPS на вашому телефоні та натисніть на кнопку що зявилась', Extra.markup((markup) => {
      return markup.resize()
        .keyboard([
            markup.locationRequestButton('Відправити координати')
        ])
    }))
    }
);

bot.on('location', (ctx) => {
    let user = {};
    user['id'] = ctx.message.from.id;
    user['latitude']= ctx.message.location.latitude;
    user['longitude'] = ctx.message.location.longitude; 
    console.log(user);
    return ctx.reply(`Дякую, Ваші геолокаційні дані записано, очікуйте на повідомлення про пошук
            Меню вибору дій`, Extra.HTML().markup((m) =>
    m.inlineKeyboard([
        [m.callbackButton('Оновити свої gps координати', 'updateData')],
        [m.callbackButton('Подати заявку на пошук', 'createApp')],
        [m.callbackButton('Отримати інфо про пошук тварин','getInfo')]
       ])))
});     

bot.startPolling();