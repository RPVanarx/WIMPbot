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

    const createdRequest = {
      ...request,
      ...(await db.request.create({ ...request, userId: user.id })),
    };

    if (createdRequest.username != null) user.username = request.username;

    user.badRequests++;
    await db.user.update(user);

    await telegram.sendPhotoMessageToModerate({
      request: createdRequest,
      moderatorId: MODERATOR_GROUP_ID,
    });

    return createdRequest.id;
  },

  async updateStatus({ requestId: id, approved, moderatedBy }) {
    const ids = await db.request.update({ id, approved, active: approved, moderatedBy });
    const request = await db.request.get(ids[0]);

    if (approved) {
      const owner = await db.user.get({ id: request.userId });
      owner.badRequests--;
      await db.user.update(owner);
    }

    return request;
  },

  async getUserRequests({ platformId, platformType }) {
    const user = await db.user.get({ platformId, platformType });

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
