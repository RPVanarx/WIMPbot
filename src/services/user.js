const { user } = require('../db');

const {
  localesUA: { CREATE_REQUEST_MESSAGES },
} = require('../config');

module.exports = {
  registerUser({ platformId, platformType, latitude, longitude }) {
    return user.create({ platformId, platformType, latitude, longitude });
  },

  getUserId({ platformId, platformType }) {
    return user.getId({ platformId, platformType });
  },

  changeUserActivity({ platformId, platformType, value }) {
    return user.changeActivity({ platformId, platformType, value });
  },

  getUserActivity({ platformId, platformType }) {
    return user.getActivityStatus({ platformId, platformType });
  },

  getUsersInRequestRadius(location) {
    return user.findUsersInRequestRadius(location);
  },

  getUserName({ platformId, platformType }) {
    return user.getName({ platformId, platformType });
  },

  setUserName({ platformId, platformType, userName }) {
    return user.setName({ platformId, platformType, userName });
  },

  getUserStep({ platformId, platformType }) {
    return user.getStep({ platformId, platformType });
  },

  setUserStep({ platformId, platformType, value }) {
    return user.setStep({ platformId, platformType, value });
  },

  getUserLocation({ platformId, platformType }) {
    return user.getLocation({ platformId, platformType });
  },

  getPlatformTypeRequestId(requestId) {
    return user.getPlatformTypeFromRequest(requestId);
  },

  getPlatformIdFromRequest(requestId) {
    return user.getPlatformId(requestId);
  },

  async canUserCreateRequest({ platformId, platformType }) {
    const platform = { platformId, platformType };
    const badRequestCount = await user.badRequestCount(platform);
    if (badRequestCount < 5) {
      return true;
    }
    const lastRequestTime = await user.getTimeOfLastRequest(platform);
    if (new Date() - lastRequestTime < CREATE_REQUEST_MESSAGES.BLOCK_INTERVAL) {
      return false;
    }
    await user.resetBadRequest(platform);
    return true;
  },
};
