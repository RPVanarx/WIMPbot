const { mainMenu } = require('./menu');

module.exports = (value, ctx) => {
    const message = value;
    console.log(message);

    switch (message.id) {
        case 1:
            if ('location' in message) {
                ctx.reply('Вітаю, ви зареєструвалися в системі', mainMenu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введенна локація, спробуйте знову', mainMenu);
            }
            break;

        case 2:

            if ('location' in message) {
                ctx.reply('Локацію змінено', mainMenu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введенна локація, спробуйте знову', mainMenu);
            }
            break;

        case 3:
            if (message.answer === true) {
                ctx.reply('Вашу локацію видалено', mainMenu);
            } else (ctx.reply('Відміна видалення', mainMenu));
            break;


        case 4:
            if ('photo' in message && 'location' in message && 'description' in message) {
                ctx.reply('Заявка оброблена та внесена на модерацію', mainMenu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введено один із пунктів, спробуйте знову', mainMenu);
            }
            break;

        case 5:
            if ('photo' in message && 'location' in message && 'description' in message) {
                ctx.reply('Заявка оброблена та внесена на модерацію', mainMenu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введено один із пунктів, спробуйте знову', mainMenu);
            }
            break;

        case 6:
            ctx.reply('Ваша заявка перенесена в архів', mainMenu);
            break;

        case 7:
            if ('radius' in message && 'days' in message) {
                ctx.reply('Заявка оброблена', mainMenu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введено один із пунктів, спробуйте знову', mainMenu);
            }
            break;
        default:
            console.log('error');
            ctx.reply('помилка запиту');
    }
};
