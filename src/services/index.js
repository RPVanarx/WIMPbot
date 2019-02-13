const { user } = require('../db/user');
const { requests } = require('../db/requests');

async function registerUser(id, userType, userName, latitude, longitude) {
  await user.create(id, userType, userName, latitude, longitude);
}

async function changeUserActivity(id, userType, value) {
  await user.changeActivity(id, userType, value);
}

async function createRequest(request) {
  const createdRequest = await requests.create(request);
  return createdRequest;
}

async function userRequests(platformId, platformType) {
  const arrOfRequests = await requests.findToDelete(platformId, platformType);
  return arrOfRequests;
}

async function deleteRequest(id) {
  await requests.deleteRequest(id);
}

async function userActivity(platformId, platformType) {
  const value = await user.activeValue(platformId, platformType);
  return value;
}

async function getRequests(platformId, platformType, radius, days) {
  const infoRequests = await requests.search(platformId, platformType, radius, days);
  return infoRequests;
}

async function changeRequestActiveStatus(reqId, value, moderatorId) {
  const request = await requests.changeActiveStatus(reqId, value, moderatorId);
  return request;
}

async function usersInRequestRadius(location) {
  const users = await user.usersInRequestRadius(location);
  return users;
}

module.exports = {
  registerUser,
  changeUserActivity,
  createRequest,
  userRequests,
  getRequests,
  deleteRequest,
  userActivity,
  changeRequestActiveStatus,
  usersInRequestRadius,
};