const { user, request } = require('../db');
const { sendPhotoMessage } = require('../telegram/addFunctions');
const bot = require('../telegram/bot');
const { SERVICES_MESSAGES } = require('../config');

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
      bot.telegram.sendMessage(userRequest.platform_id, SERVICES_MESSAGES.MODERATION_FALSE);
      return;
    }
    bot.telegram.sendMessage(userRequest.platform_id, SERVICES_MESSAGES.MODERATION_TRUE);
    const users = await getUsersInRequestRadius(userRequest.location);
    users.forEach(element =>
      sendPhotoMessage({ request: userRequest, chatId: element.platform_id }),
    );
  } catch (error) {
    console.error(`moderate ${error}`);
  }
}

function getFileLink(id) {
  return bot.telegram.getFileLink(id);
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
};
