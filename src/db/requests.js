const user = require('../dbconnect');

async function create(platformId, platformType, requestType, longitude, latitude, photo, message) {
    await user.query(
        'INSERT INTO requests VALUES(DEFAULT,(SELECT id FROM users WHERE platform_id = $1 AND platform_type = $2), $3, (point($4, $5)), $6, $7, now())',
        [platformId, platformType, requestType, longitude, latitude, photo, message],
    );
}

async function findToDelete(platformId, platformType) {
    return (await user.query(
        'SELECT id, photo, message FROM requests WHERE user_id = (SELECT id FROM users WHERE platform_id = $1 AND platform_type = $2) AND is_active = true',
        [platformId, platformType],
    )).rows;
}

async function deleteRequest(id) {
    user.query('UPDATE requests SET is_active = false WHERE id = $1', [id]);
}

async function search(platformId, platformType, radius, days) {
    return (await user.query(
        'SELECT r.request_type, r.photo, r.message, r.creation_date, u.user_name, u.platform_type FROM requests AS r, users AS u WHERE ((SELECT location FROM users WHERE platform_id = $1 AND platform_type = $2) <@> r.location) <= $3/1609.34 AND u.id = r.user_id AND r.is_active = true AND r.creation_date >= (now() AT TIME ZONE \'UTC\' - $4 * interval \'1 day\')',
        [platformId, platformType, radius, days],
    )).rows;
}

module.exports = {
    requests: {
        create,
        findToDelete,
        deleteRequest,
        search,
    },
};
