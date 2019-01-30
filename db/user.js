const user = require('../dbconnect');

async function create(platformId, userType, userName, latitude, longitude) {
    try {
        await user.query(
            `INSERT INTO users VALUES(
            DEFAULT,
            '${platformId}',
            '${userType}',
            '${userName}',
            '(${latitude},${longitude})',
            0,
            true
        )
        ON CONFLICT (platformId, platformType)
        DO UPDATE SET 
            location = '(${latitude}, ${longitude})'`,
        );
    } catch (error) {
        throw new Error(error);
    }
}

async function changeActivity(platformId, userType, value) {
    try {
        await user.query(
            `UPDATE users
            SET isactive = '${value}'
            WHERE platformId = '${platformId}' AND platformType = '${userType}'`,
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
