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

async function activeValue(platformId, userType) {
    try {
        const userActivirty = await user.query(
            'SELECT is_active FROM users WHERE platform_id = $1 AND platform_type = $2',
            [platformId, userType],
        );
        return userActivirty.rows[0].is_active;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    user: {
        create,
        changeActivity,
        activeValue,
    },
};
