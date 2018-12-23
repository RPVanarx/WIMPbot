const menu = require('./menu');

module.exports = (value, ctx) => {
    const message = value;
    console.log(message);

    switch (message.id) {
        case 1:
            if ('location' in message) {
                ctx.reply('Заявка оброблена', menu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введенна локація, спробуйте знову', menu);
            }
            break;
        case 2:
            if ('photo' in message && 'location' in message && 'description' in message) {
                ctx.reply('Заявка оброблена', menu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введено один із пунктів, спробуйте знову', menu);
            }
            break;
        case 3:
            if ('radius' in message && 'days' in message) {
                ctx.reply('Заявка оброблена', menu);
                // code connect to database
            } else {
                ctx.reply('Неправильно введено один із пунктів, спробуйте знову', menu);
            }
            break;
        default:
            console.log('error');
            ctx.reply('помилка запиту');
    }
};
