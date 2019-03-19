const { user, request } = require('../db');
const { sendPhotoMessage } = require('../telegram/addFunctions');
const bot = require('../telegram/bot');
const { SERVICES_MESSAGES } = require('../config');

function registerUser({ platformId, platformType, latitude, longitude }) {
  user.create({ platformId, platformType, latitude, longitude });
}

function changeUserActivity({ platformId, platformType, value }) {
  user.changeActivity({ platformId, platformType, value });
}

function createRequest(req) {
  return request.create(req);
}

function getUserRequests({ platformId, platformType }) {
  return request.findToDelete({ platformId, platformType });
}

function deleteRequest(id) {
  request.deleteRequest(id);
}

function userActivity({ platformId, platformType }) {
  return user.activeValue({ platformId, platformType });
}

function getRequests({ platformId, platformType, radius, days }) {
  return request.search(platformId, platformType, radius, days);
}

function getRequestsInArea({ longitude, latitude, radius, days }) {
  return request.searchInArea(longitude, latitude, radius, days);
}

function usersInRequestRadius(location) {
  return user.usersInRequestRadius(location);
}

function getBadRequestCount({ platformId, platformType }) {
  return user.badRequestCount({ platformId, platformType });
}

async function startModerateRequest({ reqId, statusString, moderatorId }) {
  try {
    const status = JSON.parse(statusString);
    const userRequest = await request.changeActiveStatus({ reqId, status, moderatorId });
    if (!status) {
      bot.telegram.sendMessage(userRequest.platform_id, SERVICES_MESSAGES.MODERATION_FALSE);
      return;
    }
    bot.telegram.sendMessage(userRequest.platform_id, SERVICES_MESSAGES.MODERATION_TRUE);
    const users = await usersInRequestRadius(userRequest.location);
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
  getRequests,
  getRequestsInArea,
  deleteRequest,
  userActivity,
  usersInRequestRadius,
  getBadRequestCount,
  startModerateRequest,
  getFileLink,
};
