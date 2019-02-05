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

async function findToDelete(platformId, platformType) {
    let foundRequests;
    try {
        foundRequests = await user.query(
            'SELECT id, photo, message FROM requests WHERE user_id = (SELECT id FROM users WHERE platform_id = $1 AND platform_type = $2) AND is_active = true',
            [platformId, platformType],
        );
    } catch (error) {
        throw new Error(error);
    }
    return foundRequests.rows;
}

async function deleteRequest(id) {
    try {
        user.query('UPDATE requests SET is_active = false WHERE id = $1', [id]);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    requests: {
        create,
        findToDelete,
        deleteRequest,
    },
};
