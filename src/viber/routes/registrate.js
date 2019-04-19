const TextMessage = require('viber-bot').Message.Text;
const bot = require('../bot');

bot.onTextMessage(/registrate/, (message, response) => {
  bot.sendMessage(
    response.userProfile,
    new TextMessage(
      'Вкл гпс і використовуючи функцію месенджера відправте координати, по яким ви будете отримувати заявки від користувачів',
    ),
  );
});
