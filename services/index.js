const user = require('../db/user');
const searchRequest = require('../db/searchRequests');
const foundRequest = require('../db/foundRequest');
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
    searchRequest.create(pet);
    const users = user.findByLocation(pet.location.longitude, pet.location.langitude, RADIUS);
    // return array of users who are in a radius of search
    user.sendSearchMessage(users, pet); // send searchMessage to users
    return true; // ?
}

function createFoundRequest(pet) {
    foundRequest.create(pet);
    const users = user.findByLocation(pet.location.longitude, pet.location.langitude, RADIUS);
    user.sendFoundMessage(users, pet);
    return true;
}

function userSearchRequests(client) {
    const allSearchRequests = searchRequest.findByUser(client.id);
    user.sendSearchMessage(client.id, allSearchRequests);
    return true;
}

function userFoundRequests(client) {
    const allSearchRequests = searchRequest.findByUser(client.id);
    user.sendFoundMessage(client.id, allSearchRequests);
    return true;
}

function deleteSearchRequest(id) {
    return searchRequest.delete(id);
}

function deleteFoundRequest(id) {
    return foundRequest.delete(id);
}

function getSearchRequests(client, radius, days) {
    if (!user.isExist(client.id)) { return false; }
    // user.get (id) достать юзера  searchrequest.find(long, lat, radius, date)
    const clientLocation = user.getLocation(client.id);
    const searchRequests = searchRequest.find(clientLocation, radius, days);
    user.sendSearchMessage(searchRequests);
    return true;
}

function getFoundRequests(client, radius, days) {
    if (!user.isExist(client.id)) { return false; }
    // user.get (id) достать юзера  searchrequest.find(long, lat, radius, date)
    const clientLocation = user.getLocation(client.id);
    const foundRequests = foundRequest.find(clientLocation, radius, days);
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
