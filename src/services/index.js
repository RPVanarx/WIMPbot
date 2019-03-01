const { user, request } = require('../db');
const { sendPhotoMessage } = require('../telegram/addFunctions');

function registerUser({ platformId, platformType, latitude, longitude }) {
  user.create({ platformId, platformType, latitude, longitude });
}

function changeUserActivity({ platformId, platformType, value }) {
  user.changeActivity({ platformId, platformType, value });
}

function createRequest(req) {
  return request.create(req);
}

function userRequests({ platformId, platformType }) {
  return request.findToDelete(platformId, platformType);
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

async function startModerateRequest({ ctx, reqId, value, moderatorId }) {
  try {
    const data = JSON.parse(value);
    const userRequest = await request.changeActiveStatus({ reqId, data, moderatorId });
    if (!data) {
      ctx.telegram.sendMessage(
        userRequest.platform_id,
        'Ваша заявка не пройшла модерацію і була відхилена',
      );
      return;
    }
    ctx.telegram.sendMessage(
      userRequest.platform_id,
      'Ваша заявка пройшла модерацію і була опублінована в системі',
    );
    const users = await usersInRequestRadius(userRequest.location);
    users.forEach(element =>
      sendPhotoMessage({ ctx, request: userRequest, chatId: element.platform_id }),
    );
  } catch (error) {
    console.error(`moderate ${error}`);
  }
}

module.exports = {
  registerUser,
  changeUserActivity,
  createRequest,
  userRequests,
  getRequests,
  getRequestsInArea,
  deleteRequest,
  userActivity,
  usersInRequestRadius,
  getBadRequestCount,
  startModerateRequest,
};
