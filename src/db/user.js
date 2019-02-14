const user = require('../dbconnect');
const { RADIUS } = require('../config');

async function create(platformId, userType, userName, longitude, latitude) {
  await user.query(
    'INSERT INTO users VALUES(DEFAULT, $1, $2, $3, (point($4, $5))) ON CONFLICT (platform_id, platform_type) DO UPDATE SET location = (point($4, $5))',
    [platformId, userType, userName, latitude, longitude],
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

async function usersInRequestRadius(location) {
  return (await user.query(
    'SELECT platform_id FROM users WHERE is_active = true AND location <@> point($1, $2) <= $3/1609.34',
    [location.x, location.y, RADIUS],
  )).rows;
}

module.exports = {
  create,
  changeActivity,
  activeValue,
  usersInRequestRadius,
};
