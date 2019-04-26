const { request } = require('../db');

const telegram = require('../telegram/addFunctions');

const {
  credentials: { MODERATOR_GROUP_ID },
} = require('../config');

module.exports = {
  async createRequest(req) {
    const id = await request.create(req);
    await telegram.sendPhotoMessageToModerate({
      request: { ...req, reqId: id, creationDate: new Date() },
      moderatorId: MODERATOR_GROUP_ID,
    });
    return id;
  },

  // TODO: check it it's necessary, then remove.
  // createRequest(req) {
  //   return request.create(req);
  // },

  changeRequestActiveStatus({ reqId, status, moderatorId }) {
    return request.changeActiveStatus({ reqId, status, moderatorId });
  },

  getUserRequests({ platformId, platformType }) {
    return request.getRequestsToDelete({ platformId, platformType });
  },

  deleteRequest(id) {
    return request.deleteRequest(id);
  },

  getRequestsInRegLocation({ platformId, platformType, radius, days }) {
    return request.search({ platformId, platformType, radius, days });
  },

  getRequestsInArea({ longitude, latitude, radius, days }) {
    return request.searchInArea({ longitude, latitude, radius, days });
  },
};
