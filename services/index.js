// const user = require('../db/user');
const requests = require('../db/requests');

const { RADIUS } = require('../config');

function registerUser(id, userName, userType, latitude, longitude) {
    // if (user.isExist(client.id)) { return false; }
    // user.create(client.id, client.location.longitude, client.location.latitude);
    console.log(`${id} ${userName} ${userType} ${latitude} ${longitude}`);
    return true;
}

function updateUserLocation(id, userType, latitude, longitude) {
    // if (!user.isExist(client.id)) { return false; }
    // user.updateLocation(client.id, client.location.longitude, client.location.latitude);
    console.log(`${id} ${userType} ${latitude} ${longitude}`);
    return true;
}

function deleteUser(id, userType) {
    // if (!user.isExist(client.id)) { return false; }
    // user.delete(client.id);
    console.log(`${id} ${userType}`);
    return true;
}

function createRequest(id, userType, typeReq, photo, message, latitude, longitude, date) {
    // requests.create(pet);
    // const users = user.findByLocation(pet.location.longitude, pet.location.langitude, RADIUS);
    // return array of users who are in a radius of search
    // user.sendSearchMessage(users, pet); // send searchMessage to users
    const type = typeReq;
    console.log(`${id} ${userType} ${type} ${latitude} ${longitude} ${photo} ${message} ${RADIUS} ${date}`);
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
    updateUserLocation,
    deleteUser,
    createRequest,
    userRequests,
    closeSearchRequest,
    getRequests,
};
