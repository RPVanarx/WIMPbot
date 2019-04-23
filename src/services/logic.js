const {
  sendPhotoMessageTelegram,
  sendMessageTelegram,
  getFileLink,
  sendPhotoStream,
  sendPhotoMessageToModerate,
  getNewPhotoId,
} = require('../telegram/addFunctions');
const log = require('../logger')(__filename);
const {
  getBadRequestCount,
  getTimeOfLastRequestFromUser,
  setBadRequestCountZero,
  getPlatformTypeRequestId,
  changeRequestActiveStatus,
  getUsersInRequestRadius,
  createRequest,
} = require('./requestDB');
const { sendMessageViber, sendPhotoMessageViber } = require('../viber/utils');
const {
  localesUA: { SERVICES_MESSAGES, CREATE_REQUEST_MESSAGES },
  credentials: { MODERATOR_GROUP_ID },
} = require('../config');

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

function sendMessage(platformType, userId, message) {
  if (platformType === 'telegram') return sendMessageTelegram(userId, message);
  if (platformType === 'viber') return sendMessageViber(userId, message);
  return false;
}

async function sendPhotoMessage({ platformType, userRequest, photo, chatId }) {
  let sendRequestMessage;
  let photoURL = photo;
  if (platformType === 'telegram') sendRequestMessage = sendPhotoMessageTelegram;
  if (platformType === 'viber') {
    sendRequestMessage = sendPhotoMessageViber;
    photoURL = await getFileLink(photo);
  }
  const res = await sendRequestMessage({ request: userRequest, photo: photoURL, chatId });
  return res;
}

async function processModerationRequest({ reqId, statusString, moderatorId }) {
  try {
    const platformType = await getPlatformTypeRequestId(reqId);
    const status = JSON.parse(statusString);
    const userRequest = await changeRequestActiveStatus({ reqId, status, moderatorId });
    if (!status) {
      sendMessage(platformType, userRequest.platform_id, SERVICES_MESSAGES.MODERATION_FALSE);
      return;
    }
    sendMessage(platformType, userRequest.platform_id, SERVICES_MESSAGES.MODERATION_TRUE);
    const users = await getUsersInRequestRadius(userRequest.location);
    users.forEach(client => {
      sendPhotoMessage({
        platformType: client.platform_type,
        userRequest,
        photo: userRequest.photo,
        chatId: client.platform_id,
      });
    });
  } catch (error) {
    log.error({ err: error, reqId, statusString }, 'process moderate request');
  }
}

async function createRequestAndModerate(req) {
  const id = await createRequest(req);
  await sendPhotoMessageToModerate({
    request: { ...req, reqId: id, creationDate: new Date() },
    moderatorId: MODERATOR_GROUP_ID,
  });
  return id;
}

module.exports = {
  createRequest: createRequestAndModerate,
  sendMessage,
  sendPhotoMessage,
  processModerationRequest,
  isUserCanCreateRequest,
  getFileLink,
  sendPhotoStream,
  getNewPhotoId,
};
