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
    const text = 'UPDATE users SET isactive = $1 WHERE platformId = $2 AND platformType = $3';
    const values = [value, platformId, userType];
    try {
        await user.query(text, values);
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
