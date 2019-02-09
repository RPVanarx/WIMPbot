const { user } = require('../db/user');
const { requests } = require('../db/requests');

// const { RADIUS } = require('../config');

async function registerUser(id, userType, userName, latitude, longitude) {
    await user.create(id, userType, userName, latitude, longitude);
}

async function changeUserActivity(id, userType, value) {
    await user.changeActivity(id, userType, value);
}

async function createRequest(platformId, platformType, reqType, img, message, latitude, longitude) {
    await requests.create(platformId, platformType, reqType, img, message, latitude, longitude);
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

module.exports = {
    registerUser,
    changeUserActivity,
    createRequest,
    userRequests,
    getRequests,
    deleteRequest,
    userActivity,
};
