const user = require('../dbconnect');

async function create(platformId, platformType, requestType, latitude, longitude, photo, message) {
    try {
        await user.query(
            'INSERT INTO requests VALUES(DEFAULT,(SELECT id FROM users WHERE platform_id = $1 AND platform_type = $2), $3, (point($4, $5)), $6, $7, now())',
            [platformId, platformType, requestType, latitude, longitude, photo, message],
        );
    } catch (error) {
        throw new Error(error);
    }
}
module.exports = {
    requests: {
        create,
    },
};
