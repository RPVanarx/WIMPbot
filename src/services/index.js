const { user, request } = require('../db');
const {
  sendPhotoMessage,
  sendMessage,
  getFileLink,
  sendPhotoStream,
  sendPhotoMessageToModerate,
} = require('../telegram/addFunctions');
const { SERVICES_MESSAGES, CREATE_REQUEST_MESSAGES, MODERATOR_GROUP_ID } = require('../config');
const log = require('../logger')(__filename);

function registerUser({ platformId, platformType, latitude, longitude }) {
  return user.create({ platformId, platformType, latitude, longitude });
}

function changeUserActivity({ platformId, platformType, value }) {
  return user.changeActivity({ platformId, platformType, value });
}

function getUserId({ platformId, platformType }) {
  return user.getId({ platformId, platformType });
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

function getTimeOfLastRequestFromUser({ platformId, platformType }) {
  return user.getTimeOfLastRequest({ platformId, platformType });
}

function setBadRequestCountZero({ platformId, platformType }) {
  return user.updateBadRequestCountToZero({ platformId, platformType });
}

async function isUserCanCreateRequest({ platformId, platformType }) {
  const badRequestCount = await getBadRequestCount({ platformId, platformType });
  if (badRequestCount < 5) {
    return true;
  }
  const lastRequestTime = await getTimeOfLastRequestFromUser({ platformId, platformType });
  if (new Date() - lastRequestTime < CREATE_REQUEST_MESSAGES.BLOCK_INTERVAL) {
    return false;
  }
  await setBadRequestCountZero({ platformId, platformType });
  return true;
}

async function moderateRequest(requestId) {
  const req = await request.get(requestId);
  sendPhotoMessageToModerate({ request: req, moderatorId: MODERATOR_GROUP_ID });
}

module.exports = {
  registerUser,
  changeUserActivity,
  getUserId,
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
  getTimeOfLastRequestFromUser,
  setBadRequestCountZero,
  isUserCanCreateRequest,
  moderateRequest,
};
