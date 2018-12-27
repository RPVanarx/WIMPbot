const { User } = require('../dbwrapper');

function userRegistration(user) {
    if (!User.isExist(user.id)) { // if user exist in base
        User.addToBase(user.id, user.location);
        return true;
    }
    return false;
}

function userChangeLocation(user) {
    if (User.isExist(user.id)) {
        User.changeLocation(user.id, user.location);
        return true;
    }
    return false;
}

function userDelete(user) {
    if (User.isExist(user.id)) {
        User.delete(user.id);
        return true;
    }
    return false;
}

function addSearchRequest(pet) {
    User.addSearch(pet);
    return User.whoUsersInRadius(pet.location); // return array of user who is in a radius of search
}

function addFindRequest(pet) {
    User.addFind(pet);
    return User.whoUsersInRadius(pet.location); // return array of user who is in a radius of find
}

function allUserRequests(user) {
    return User.searchRequest(user).push(...User.findRequest(user));
    // return to user array of his requests
}

function deleteUserRequest(request) {
    return User.deleteRequest(request); // if delete true else false
}

function requestInfo(user, request) {
    if (User.isExist(user.id)) {
        return User.findAllReguest(user, request);
        // return array all request which is true for search point(length, days) if user is reg
    }
    return false;
}

module.exports = {
    userRegistration,
    userChangeLocation,
    userDelete,
    addSearchRequest,
    addFindRequest,
    allUserRequests,
    deleteUserRequest,
    requestInfo,
};
