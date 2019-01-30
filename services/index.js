const { user } = require('../db/user');
const { requests } = require('../db/requests');

const { RADIUS } = require('../config');

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

async function createRequest(request) {
    try {
        await requests.create(request);
    } catch (error) {
        throw new Error(error);
    }

    // requests.create(pet);
    // const users = user.findByLocation(pet.location.longitude, pet.location.langitude, RADIUS);
    // return array of users who are in a radius of search
    // user.sendSearchMessage(users, pet); // send searchMessage to users
    return true;
}


function userRequests(id, userType) {
    // const allSearchRequests = requests.findByUser(client.id);
    // user.sendSearchMessage(client.id, allSearchRequests);
    console.log(`${id} ${userType}`);
    return [1, 2, 3];
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
};
