const dbconnect = require('../dbconnect');

const {
  DEFAULT_VALUES: { RADIUS },
} = require('../config');

let client;
dbconnect.then(res => {
  client = res;
});

async function create({ platformId, platformType, longitude, latitude }) {
  await client.query(
    'INSERT INTO users VALUES(DEFAULT, $1, $2, DEFAULT, (point($3, $4))) ON CONFLICT (platform_id, platform_type) DO UPDATE SET location = (point($3, $4))',
    [platformId, platformType, longitude, latitude],
  );
}

async function changeActivity({ platformId, platformType, value }) {
  await client.query(
    'UPDATE users SET is_active = $1 WHERE platform_id = $2 AND platform_type = $3',
    [value, platformId, platformType],
  );
}

async function activeValue({ platformId, platformType }) {
  return (await client.query(
    'SELECT is_active FROM users WHERE platform_id = $1 AND platform_type = $2',
    [platformId, platformType],
  )).rows[0].is_active;
}

async function usersInRequestRadius(location) {
  return (await client.query(
    `SELECT platform_id FROM users 
    WHERE is_active = true 
    AND location <@> point($1, $2) <= $3/1609.34`,
    [location.x, location.y, RADIUS],
  )).rows;
}

async function badRequestCount({ platformId, platformType }) {
  return (await client.query(
    'SELECT bad_request_count FROM users WHERE platform_id = $1 and platform_type = $2',
    [platformId, platformType],
  )).rows[0].bad_request_count;
}

module.exports = {
  create,
  changeActivity,
  activeValue,
  usersInRequestRadius,
  badRequestCount,
};
