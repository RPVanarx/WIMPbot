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

  async processModerationRequest({
    requestId,
    approved,
    moderator: { platformId: modPId, platformType: modPType },
  }) {
    try {
      const moderatedBy = await user.getUserId({ platformType: modPType, platformId: modPId });
      const req = await request.updateStatus({ requestId, approved, moderatedBy });

      const { platformType, platformId, username } = await user.getRequestOwner(requestId);
      const modMessage = approved ? MODERATION_TRUE : MODERATION_FALSE;
      message.sendMessage(platformType, platformId, modMessage);

      if (!approved) return;

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
      log.error({ err: error, requestId, approved }, 'Cannot complete request moderation');
    }
  },
};
