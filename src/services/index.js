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
      const platformType = await user.getPlatformTypeRequestId(reqId);
      const status = JSON.parse(statusString);
      const userRequest = await request.changeRequestActiveStatus({ reqId, status, moderatorId });
      if (!status) {
        message.sendMessage(platformType, userRequest.platform_id, MODERATION_FALSE);
        return;
      }
      message.sendMessage(platformType, userRequest.platform_id, MODERATION_TRUE);
      const users = await user.getUsersInRequestRadius(userRequest.location);
      users.forEach(client => {
        message.sendPhotoMessage({
          platformType: client.platform_type,
          userRequest,
          photo: userRequest.photo,
          chatId: client.platform_id,
        });
      });
    } catch (error) {
      log.error({ err: error, reqId, statusString }, 'process moderate request');
    }
  },
};
