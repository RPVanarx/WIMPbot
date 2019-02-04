const { user } = require('../db/user');
const { requests } = require('../db/requests');

// const { RADIUS } = require('../config');

async function registerUser(id, userType, userName, latitude, longitude) {
    try {
        await user.create(id, userType, userName, latitude, longitude);
    } catch (error) {
        throw new Error(error);
    }
    return true;
}

async function changeUserActivity(id, userType, value) {
    try {
        await user.changeActivity(id, userType, value);
    } catch (error) {
        throw new Error(error);
    }
    return true;
}

async function createRequest(platformId, platformType, reqType, img, message, latitude, longitude) {
    try {
        await requests.create(platformId, platformType, reqType, img, message, latitude, longitude);
    } catch (error) {
        throw new Error(error);
    }
    return true;
}


async function userRequests(platformId, platformType) {
    let arrayOfRequests;
    try {
        arrayOfRequests = await requests.findToDelete(platformId, platformType);
    } catch (error) {
        throw new Error(error);
    }
    return arrayOfRequests;
}

async function deleteRequest(id) {
    try {
        await requests.deleteRequest(id);
    } catch (error) {
        throw new Error(error);
    }
}

function closeSearchRequest(id) {
    return requests.delete(id);
}

function getRequests(id, newRadius, days) {
    // if (!user.isExist(client.id)) { return false; }
    // user.get (id) достать юзера  searchrequest.find(long, lat, radius, date)
    // const clientLocation = user.getLocation(client.id);
    // const searchRequests = requests.find(clientLocation, radius, days);
    // user.sendSearchMessage(searchRequests);
    console.log(`${id} ${newRadius} ${days}`);
    return true;
}

module.exports = {
    registerUser,
    changeUserActivity,
    createRequest,
    userRequests,
    closeSearchRequest,
    getRequests,
    deleteRequest,
};
