// const db = require('../dbconnect');

function isExist(id) {
    console.log(`${id} isExist`);
    // select SQL to base
    return false;
}

function addToBase(id, location) {
    console.log(`${id} add to base with location ${location.latitude} + ${location.longitude}`);
    // input SQL to base
    return true;
}

module.exports = { isExist, addToBase };
