const user = require('../dbconnect');

async function create(platformId, userType, userName, longitude, latitude) {
    await user.query(
        'INSERT INTO users VALUES(DEFAULT, $1, $2, $3, (point($4, $5))) ON CONFLICT (platform_id, platform_type) DO UPDATE SET location = (point($4, $5))',
        [platformId, userType, userName, longitude, latitude],
    );
}

async function changeActivity(platformId, userType, value) {
    await user.query(
        'UPDATE users SET is_active = $1 WHERE platform_id = $2 AND platform_type = $3',
        [value, platformId, userType],
    );
}

async function activeValue(platformId, userType) {
    return (await user.query(
        'SELECT is_active FROM users WHERE platform_id = $1 AND platform_type = $2',
        [platformId, userType],
    )).rows[0].is_active;
}

module.exports = {
    user: {
        create,
        changeActivity,
        activeValue,
    },
};
