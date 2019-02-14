function createMessage(request) {
  return `Тип заявки: ${request.requestType === 'search' ? 'пошук' : 'знайшли'}
Меседжер: ${request.platformType === 'telegram' ? 'телеграм' : 'вайбер'}
Відправник: ${request.platformType === 'telegram' ? '@' : ''}${request.userName}
Дата заявки: ${request.creationDate.toLocaleString()}
Повідомлення від користувача: ${request.message}`;
}

function sendPhotoMessage({ ctx, request, chatId }) {
  ctx.telegram.sendPhoto(chatId, request.photo, {
    reply_markup: {
      inline_keyboard: [[{ text: 'дати коментар', callback_data: `comment:${request.reqId}` }]],
    },
    caption: createMessage({
      requestType: request.request_type,
      platformType: request.platform_type,
      userName: request.user_name,
      creationDate: request.creation_date,
      message: request.message,
    }),
  });
}

function sendPhotoMessageToModerate({ ctx, request, moderatorId }) {
  ctx.telegram.sendPhoto(moderatorId, request.photo, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'апрув', callback_data: `moderate:true:${request.reqId}` }],
        [{ text: 'деклайн', callback_data: `moderate:false:${request.reqId}` }],
      ],
    },
    caption: createMessage(request),
  });
}

module.exports = { sendPhotoMessage, sendPhotoMessageToModerate };
