const user = require('../db/user');
const requests = require('../db/requests');

const { RADIUS } = require('../config');

function registerUser(client) {
    if (user.isExist(client.id)) { return false; }
    user.create(client.id, client.location.longitude, client.location.latitude);
    return true;
}

function updateUserLocation(client) {
    if (!user.isExist(client.id)) { return false; }
    user.updateLocation(client.id, client.location.longitude, client.location.latitude);
    return true;
}

function deleteUser(client) {
    if (!user.isExist(client.id)) { return false; }
    user.delete(client.id);
    return true;
}

function createSearchRequest(pet) {
    requests.create(pet);
    const users = user.findByLocation(pet.location.longitude, pet.location.langitude, RADIUS);
    // return array of users who are in a radius of search
    user.sendSearchMessage(users, pet); // send searchMessage to users
    return true; // ?
}

function createFoundRequest(pet) {
    requests.create(pet);
    const users = user.findByLocation(pet.location.longitude, pet.location.langitude, RADIUS);
    user.sendFoundMessage(users, pet);
    return true;
}

function userSearchRequests(client) {
    const allSearchRequests = requests.findByUser(client.id);
    user.sendSearchMessage(client.id, allSearchRequests);
    return true;
}

function userFoundRequests(client) {
    const allSearchRequests = requests.findByUser(client.id);
    user.sendFoundMessage(client.id, allSearchRequests);
    return true;
}

function deleteSearchRequest(id) {
    return requests.delete(id);
}

function deleteFoundRequest(id) {
    return requests.delete(id);
}

function getSearchRequests(client, radius, days) {
    if (!user.isExist(client.id)) { return false; }
    // user.get (id) достать юзера  searchrequest.find(long, lat, radius, date)
    const clientLocation = user.getLocation(client.id);
    const searchRequests = requests.find(clientLocation, radius, days);
    user.sendSearchMessage(searchRequests);
    return true;
}

function getFoundRequests(client, radius, days) {
    if (!user.isExist(client.id)) { return false; }
    // user.get (id) достать юзера  searchrequest.find(long, lat, radius, date)
    const clientLocation = user.getLocation(client.id);
    const foundRequests = requests.find(clientLocation, radius, days);
    user.sendFoundMessage(foundRequests);
    return true;
}

module.exports = {
    registerUser,
    updateUserLocation,
    deleteUser,
    createSearchRequest,
    createFoundRequest,
    userSearchRequests,
    userFoundRequests,
    deleteSearchRequest,
    deleteFoundRequest,
    getSearchRequests,
    getFoundRequests,
};
