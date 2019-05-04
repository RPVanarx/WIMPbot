const db = require('../db');

const {
  defaultValues: { BLOCK_INTERVAL },
} = require('../config');

function getUser({ platformId, platformType }) {
  return db.user.get({ platformId, platformType });
}

module.exports = {
  async create({ platformId, platformType, latitude, longitude, username }) {
    const user = await db.user.get({ platformId, platformType });

    if (user != null) {
      return db.user.update({ id: user.id, latitude, longitude, username }).then(ids => ids[0]);
    }

    return db.user.create({ platformId, platformType, longitude, latitude, username });
  },

  async getUserId({ platformId, platformType }) {
    const user = await getUser({ platformId, platformType });
    return user && user.id;
  },

  changeUserActivity({ platformId, platformType, value }) {
    return db.user.update({ platformId, platformType, active: value });
  },

  async getUserActivity({ platformId, platformType }) {
    const user = await getUser({ platformId, platformType });
    return user && user.active;
  },

  getUsersInRadius(location) {
    return db.user.getUsersInRadius(location);
  },

  async getUserName({ platformId, platformType }) {
    const user = await getUser({ platformId, platformType });
    return user && user.name;
  },

  setUserName({ platformId, platformType, username }) {
    return db.user.update({ platformId, platformType, username });
  },

  async getUserStep({ platformId, platformType }) {
    const user = await getUser({ platformId, platformType });
    return user && user.step;
  },

  setUserStep({ platformId, platformType, value }) {
    return db.user.update({ platformId, platformType, step: value });
  },

  async getUserLocation({ platformId, platformType }) {
    const user = await getUser({ platformId, platformType });
    return user && user.location;
  },

  async getRequestOwner(requestId) {
    const { userId } = await db.request.get(requestId);
    return db.user.get({ id: userId });
  },

  async canUserCreateRequest({ platformId, platformType }) {
    const user = await getUser({ platformId, platformType });

    if (user.badRequests < 5) return true;

    const lastRequest = await db.request.getLastRequest({ userId: user.id });
    if (lastRequest && new Date() - lastRequest.created < BLOCK_INTERVAL) {
      return false;
    }

    await db.user.update({ id: user.id, badRequests: 0 });
    return true;
  },
};
