const { user, request } = require('../db');

function createRequest(req) {
  return request.create(req);
}

function registerUser({ platformId, platformType, latitude, longitude }) {
  return user.create({ platformId, platformType, latitude, longitude });
}

function changeUserActivity({ platformId, platformType, value }) {
  return user.changeActivity({ platformId, platformType, value });
}

function changeRequestActiveStatus({ reqId, status, moderatorId }) {
  return request.changeActiveStatus({ reqId, status, moderatorId });
}

function getUserId({ platformId, platformType }) {
  return user.getId({ platformId, platformType });
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

function getPlatformTypeRequestId(requestId) {
  return user.getPlatformTypeFromRequest(requestId);
}

function getTimeOfLastRequestFromUser({ platformId, platformType }) {
  return user.getTimeOfLastRequest({ platformId, platformType });
}

function setBadRequestCountZero({ platformId, platformType }) {
  return user.updateBadRequestCountToZero({ platformId, platformType });
}

function getUserName({ platformId, platformType }) {
  return user.getName({ platformId, platformType });
}

function setUserName({ platformId, platformType, userName }) {
  return user.setName({ platformId, platformType, userName });
}

function getPlatformIdFromRequest(requestId) {
  return user.getPlatformId(requestId);
}

function getUserStep({ platformId, platformType }) {
  return user.getStep({ platformId, platformType });
}

function setUserStep({ platformId, platformType, value }) {
  return user.setStep({ platformId, platformType, value });
}

function getUserLocation({ platformId, platformType }) {
  return user.getLocation({ platformId, platformType });
}

module.exports = {
  createRequest,
  registerUser,
  changeUserActivity,
  getUserId,
  getUserRequests,
  getRequestsInRegLocation,
  getRequestsInArea,
  deleteRequest,
  getUserActivity,
  getUsersInRequestRadius,
  getBadRequestCount,
  getTimeOfLastRequestFromUser,
  setBadRequestCountZero,
  getUserName,
  setUserName,
  getPlatformIdFromRequest,
  getPlatformTypeRequestId,
  getUserStep,
  setUserStep,
  getUserLocation,
  changeRequestActiveStatus,
};
