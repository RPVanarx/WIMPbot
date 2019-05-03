const log = require('../logger')(__filename);

const user = require('./user');
const photo = require('./photo');
const request = require('./request');
const message = require('./message');

const {
  localesUA: {
    SERVICES_MESSAGES: { MODERATION_FALSE, MODERATION_TRUE },
  },
} = require('../config');

module.exports = {
  user,
  request,
  message,
  photo,

  async processModerationRequest({ reqId, statusString, moderatorId }) {
    try {
      const status = JSON.parse(statusString);
      const req = await request.updateStatus({ reqId, status, moderatorId });

      const { platformType, platformId, username } = await user.getRequestOwner(reqId);
      const modMessage = status ? MODERATION_TRUE : MODERATION_FALSE;
      message.sendMessage(platformType, platformId, modMessage);

      if (!status) return;

      const userRequest = {
        ...req,
        platformType,
        username,
      };

      const users = await user.getUsersInRadius(req.location);
      users.forEach(client => {
        message.sendPhotoMessage({
          platformType: client.platformType,
          userRequest,
          photo: req.photo,
          chatId: client.platformId,
        });
      });
    } catch (error) {
      log.error({ err: error, reqId, statusString }, 'process moderate request');
    }
  },
};
