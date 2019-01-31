const user = require('../dbconnect');

async function create(request) {
    try {
        await user.query(`INSERT INTO requests VALUES(
            DEFAULT,
            (SELECT id FROM users 
            WHERE platformId = '${request.platformId}' AND platformType = '${request.platformType}'),
            '${request.type}',
            '(${request.latitude},${request.longitude})',
            '${request.photo}',
            '${request.message}',
            'now()',
            'true',
            '44',
            'true');`);
    } catch (error) {
        throw new Error(error);
    }
}
module.exports = {
    requests: {
        create,
    },
};
