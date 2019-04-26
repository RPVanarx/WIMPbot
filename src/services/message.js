const telegram = require('../telegram/addFunctions');
const viber = require('../viber/utils');

const createMessageRequest = require('../utils/createMessageRequest');

const {
  platformType: { TELEGRAM, VIBER },
} = require('../config');

module.exports = {
  sendMessage(platformType, userId, message) {
    if (platformType === TELEGRAM) return telegram.sendMessageTelegram(userId, message);
    if (platformType === VIBER) return viber.sendMessageViber(userId, message);
    return false;
  },

  async sendPhotoMessage({ platformType, userRequest, photo, chatId }) {
    const message = createMessageRequest(
      {
        platformType: userRequest.platform_type,
        requestType: userRequest.request_type,
        userName: userRequest.user_name,
        creationDate: userRequest.creation_date,
        message: userRequest.message,
        latitude: userRequest.location.y,
        longitude: userRequest.location.x,
        id: userRequest.id,
      },
      platformType,
    );
    if (platformType === TELEGRAM) {
      return telegram.sendPhotoMessageTelegram({ message, photo, chatId });
    }
    if (platformType === VIBER) {
      const photoURL = await telegram.getFileLink(photo);
      return viber.sendPhotoMessageViber({
        message,
        photo: photoURL,
        chatId,
        requestId: userRequest.id,
      });
    }
    return true;
  },
};
