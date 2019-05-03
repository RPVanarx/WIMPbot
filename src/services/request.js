/* eslint-disable no-plusplus */
const db = require('../db');

const telegram = require('../telegram/addFunctions');

const {
  credentials: { MODERATOR_GROUP_ID },
} = require('../config');

module.exports = {
  async create(request) {
    const { platformId, platformType } = request;
    const user = await db.user.get({ platformId, platformType });

    if (user == null) throw new Error('Cannot create request: User (creator) not found');

    const { id: reqId, created: creationDate } = await db.request.create({
      ...request,
      userId: user.id,
    });

    if (request.userName != null) user.username = request.userName;

    user.badRequests++;
    await db.user.update(user);

    await telegram.sendPhotoMessageToModerate({
      request: { ...request, reqId, creationDate },
      moderatorId: MODERATOR_GROUP_ID,
    });

    return reqId;
  },

  async updateStatus({ reqId: id, status, moderatorId: moderatedBy }) {
    const ids = await db.request.update({ id, approved: status, active: status, moderatedBy });
    const request = await db.request.get({ id: ids[0] });

    if (status) {
      const owner = await db.user.get({ id: request.userId });
      owner.badRequests--;
      await db.user.update(owner);
    }

    return request;
  },

  async getUserRequests({ platformId, platformType }) {
    const user = db.user.get({ platformId, platformType });

    if (user == null) throw new Error('Cannot get requests: User (creator) not found');

    return db.request.getUserRequests(user.id);
  },

  async deleteRequest(id) {
    const ids = await db.request.update({ id, active: false });
    return ids[0];
  },

  async getInUserArea({ platformId, platformType, radius, days }) {
    const user = await db.user.get({ platformId, platformType });

    if (user == null) throw new Error('Cannot get requests: User (creator) not found');

    return db.request.getInArea({ location: user.location, radius, days });
  },

  getInArea({ longitude, latitude, radius, days }) {
    const location = { x: longitude, y: latitude };
    return db.request.getInArea({ location, radius, days });
  },
};
