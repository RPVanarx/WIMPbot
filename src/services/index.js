const { user, request } = require('../db');
const {
  sendPhotoMessageTelegram,
  sendMessageTelegram,
  getFileLink,
  sendPhotoStream,
  sendPhotoMessageToModerate,
  getNewPhotoId,
} = require('../telegram/addFunctions');
const { sendMessageViber, sendPhotoMessageViber } = require('../viber/utils');
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

async function createRequest(req) {
  const id = await request.create(req);
  await sendPhotoMessageToModerate({
    request: { ...req, reqId: id, creationDate: new Date() },
    moderatorId: MODERATOR_GROUP_ID,
  });
  return id;
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

function sendMessage(platformType, userId, message) {
  let sendMessageType;
  if (platformType === 'telegram') sendMessageType = sendMessageTelegram;
  if (platformType === 'viber') sendMessageType = sendMessageViber;
  return sendMessageType(userId, message);
}

function makePhotoURL(photoId) {
  // тут я маю підключити створення урли фотки на нашу апі
  return 'https://dl-media.viber.com/1/share/2/long/vibes/icon/image/0x0/1433/673465886be1a0cabc915dad06fa14f71b6f80496ca0943dea5b85a4f54a1433.jpg';
}

function sendPhotoMessage({ platformType, userRequest, photo, chatId }) {
  let sendRequestMessage;
  let photoURL = photo;
  if (platformType === 'telegram') sendRequestMessage = sendPhotoMessageTelegram;
  if (platformType === 'viber') {
    sendRequestMessage = sendPhotoMessageViber;
    photoURL = makePhotoURL(photo);
  }
  return sendRequestMessage({ request: userRequest, photo: photoURL, chatId });
}

async function processModerationRequest({ reqId, statusString, moderatorId }) {
  try {
    const platformType = await getPlatformTypeRequestId(reqId);
    const status = JSON.parse(statusString);
    const userRequest = await request.changeActiveStatus({ reqId, status, moderatorId });
    if (!status) {
      sendMessage(platformType, userRequest.platform_id, SERVICES_MESSAGES.MODERATION_FALSE);
      return;
    }
    sendMessage(platformType, userRequest.platform_id, SERVICES_MESSAGES.MODERATION_TRUE);
    const users = await getUsersInRequestRadius(userRequest.location);
    users.forEach(client =>
      sendPhotoMessage({
        platformType: client.platform_type,
        userRequest,
        photo: userRequest.photo,
        chatId: client.platform_id,
      }),
    );
  } catch (error) {
    log.error({ err: error, reqId, statusString }, 'process moderate request');
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

async function getUserName({ platformId, platformType }) {
  return user.getName({ platformId, platformType });
}

async function setUserName({ platformId, platformType, userName }) {
  return user.setName({ platformId, platformType, userName });
}

async function getPlatformIdFromRequest(requestId) {
  return user.getPlatformId(requestId);
}

async function getUserStep({ platformId, platformType }) {
  return user.getStep({ platformId, platformType });
}

async function setUserStep({ platformId, platformType, value }) {
  return user.setStep({ platformId, platformType, value });
}

async function getUserLocation({ platformId, platformType }) {
  return user.getLocation({ platformId, platformType });
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
  getUserName,
  setUserName,
  getNewPhotoId,
  getPlatformIdFromRequest,
  getPlatformTypeRequestId,
  getUserStep,
  setUserStep,
  getUserLocation,
  // moderateRequest,
};
