const user = require('../dbconnect');

async function create(platformId, userType, userName, latitude, longitude) {
    try {
        await user.query(
            'INSERT INTO users VALUES(DEFAULT, $1, $2, $3, (point($4, $5))) ON CONFLICT (platform_id, platform_type) DO UPDATE SET location = (point($4, $5))',
            [platformId, userType, userName, latitude, longitude],
        );
    } catch (error) {
        throw new Error(error);
    }
}

async function changeActivity(platformId, userType, value) {
    try {
        await user.query(
            'UPDATE users SET is_active = $1 WHERE platform_id = $2 AND platform_type = $3',
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
