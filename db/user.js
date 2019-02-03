const user = require('../dbconnect');

async function create(platformId, userType, userName, latitude, longitude) {
    try {
        await user.query(
            'INSERT INTO users VALUES(DEFAULT, $1, $2, $3, (point($4, $5)), 0, true) ON CONFLICT (platformId, platformType) DO UPDATE SET location = (point($4, $5))',
            [platformId, userType, userName, latitude, longitude],
        );
    } catch (error) {
        throw new Error(error);
    }
}

async function changeActivity(platformId, userType, value) {
    try {
        await user.query(
            'UPDATE users SET isactive = $1 WHERE platformId = $2 AND platformType = $3',
            [value, platformId, userType],
        );
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    user: {
        create,
        changeActivity,
    },
};
