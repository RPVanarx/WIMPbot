function messageCreator(requestType, platformType, userName, creationDate, message) {
  return `Тип заявки: ${requestType === 'search' ? 'пошук' : 'знайшли'}
Меседжер: ${platformType === 'telegram' ? 'телеграм' : 'вайбер'}
Відправник: ${platformType === 'telegram' ? '@' : ''}${userName}
Дата заявки: ${creationDate.toLocaleString()}
Повідомлення від користувача: ${message}`;
}

function sendPhotoMessage(ctx, req, userId) {
  ctx.telegram.sendPhoto(userId, req.photo, {
    reply_markup: {
      inline_keyboard: [[{ text: 'дати коментар', callback_data: `comment:${req.reqId}` }]],
    },
    caption: messageCreator(
      req.request_type,
      req.platform_type,
      req.user_name,
      req.creation_date,
      req.message,
    ),
  });
}

function sendPhotoMessageToModerate(ctx, req, moderatorId) {
  ctx.telegram.sendPhoto(moderatorId, req.photo, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'апрув', callback_data: `moderate:true:${req.reqId}` }],
        [{ text: 'деклайн', callback_data: `moderate:false:${req.reqId}` }],
      ],
    },
    caption: messageCreator(
      req.requestType,
      req.platformType,
      req.userName,
      req.creationDate,
      req.message,
    ),
  });
}

module.exports = { messageCreator, sendPhotoMessage, sendPhotoMessageToModerate };
