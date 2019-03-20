const { user, request } = require('../db');
const {
  sendPhotoMessage,
  sendMessage,
  getFileLink,
  sendPhotoStream,
} = require('../telegram/addFunctions');
const { SERVICES_MESSAGES } = require('../config');
const log = require('../logger')(__filename);

function registerUser({ platformId, platformType, latitude, longitude }) {
  return user.create({ platformId, platformType, latitude, longitude });
}

function changeUserActivity({ platformId, platformType, value }) {
  return user.changeActivity({ platformId, platformType, value });
}

function createRequest(req) {
  return request.create(req);
}

function getUserRequests({ platformId, platformType }) {
  return request.getRequestsToDelete({ platformId, platformType });
}

function deleteRequest(id) {
  return request.deleteRequest(id);
}

function getUserActivity({ platformId, platformType }) {
  return user.getActivityStatus({ platformId, platformType });
}

function getRequestsInRegLocation({ platformId, platformType, radius, days }) {
  return request.search({ platformId, platformType, radius, days });
}

function getRequestsInArea({ longitude, latitude, radius, days }) {
  return request.searchInArea({ longitude, latitude, radius, days });
}

function getUsersInRequestRadius(location) {
  return user.findUsersInRequestRadius(location);
}

function getBadRequestCount({ platformId, platformType }) {
  return user.badRequestCount({ platformId, platformType });
}

async function processModerationRequest({ reqId, statusString, moderatorId }) {
  try {
    const status = JSON.parse(statusString);
    const userRequest = await request.changeActiveStatus({ reqId, status, moderatorId });
    if (!status) {
      sendMessage(userRequest.platform_id, SERVICES_MESSAGES.MODERATION_FALSE);
      return;
    }
    sendMessage(userRequest.platform_id, SERVICES_MESSAGES.MODERATION_TRUE);
    const users = await getUsersInRequestRadius(userRequest.location);
    users.forEach(element =>
      sendPhotoMessage({ request: userRequest, chatId: element.platform_id }),
    );
  } catch (error) {
    log.error({ err: error.message, reqId, statusString }, 'deleteUserScene');
  }
}

module.exports = {
  registerUser,
  changeUserActivity,
  createRequest,
  getUserRequests,
  getRequestsInRegLocation,
  getRequestsInArea,
  deleteRequest,
  getUserActivity,
  getUsersInRequestRadius,
  getBadRequestCount,
  processModerationRequest,
  getFileLink,
  sendPhotoStream,
};
