const client = require('../dbconnect');
const {
  defaultValues: { RADIUS },
} = require('../config');

async function create({ platformId, platformType, longitude, latitude }) {
  await client.query(
    'INSERT INTO users VALUES(DEFAULT, $1, $2, DEFAULT, (point($3, $4))) ON CONFLICT (platform_id, platform_type) DO UPDATE SET location = (point($3, $4))',
    [platformId, platformType, longitude, latitude],
  );
  return true;
}

async function changeActivity({ platformId, platformType, value }) {
  await client.query(
    'UPDATE users SET is_active = $1 WHERE platform_id = $2 AND platform_type = $3',
    [value, platformId, platformType],
  );
  return true;
}

async function getActivityStatus({ platformId, platformType }) {
  return (await client.query(
    'SELECT is_active FROM users WHERE platform_id = $1 AND platform_type = $2',
    [platformId, platformType],
  )).rows[0].is_active;
}

async function findUsersInRequestRadius(location) {
  return (await client.query(
    `SELECT platform_id, platform_type FROM users 
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

async function getTimeOfLastRequest({ platformId, platformType }) {
  return (await client.query(
    `SELECT creation_date FROM requests 
    WHERE user_id = (SELECT id FROM users WHERE platform_id = $1 and platform_type = $2)
    ORDER BY creation_date DESC`,
    [platformId, platformType],
  )).rows[0].creation_date;
}

async function updateBadRequestCountToZero({ platformId, platformType }) {
  await client.query(
    `UPDATE users SET bad_request_count = 0 
    WHERE platform_id = $1 and platform_type = $2`,
    [platformId, platformType],
  );
  return true;
}

async function getId({ platformId, platformType }) {
  const response = await client.query(
    `SELECT id FROM users
    WHERE platform_id = $1 AND platform_type = $2`,
    [platformId, platformType],
  );

  if (!response.rows.length) return undefined;

  return response.rows[0].id;
}

async function getName({ platformId, platformType }) {
  const response = await client.query(
    `SELECT user_name FROM users
        WHERE platform_id = $1 AND platform_type = $2`,
    [platformId, platformType],
  );
  return response.rows[0].user_name;
}

async function setName({ platformId, platformType, userName }) {
  await client.query(
    `UPDATE users SET user_name = $3 
        WHERE platform_id = $1 and platform_type = $2`,
    [platformId, platformType, userName],
  );
  return true;
}

async function getPlatformId(requestId) {
  return (await client.query(
    `SELECT platform_id FROM users 
      WHERE id = (SELECT user_id FROM requests WHERE id = $1)`,
    [requestId],
  )).rows[0].platform_id;
}

async function getPlatformTypeFromRequest(requestId) {
  return (await client.query(
    `SELECT platform_type FROM users 
          WHERE id = (SELECT user_id FROM requests WHERE id = $1)`,
    [requestId],
  )).rows[0].platform_type;
}

async function getStep({ platformId, platformType }) {
  return (await client.query(
    `SELECT step FROM users 
    WHERE platform_id = $1 and platform_type = $2`,
    [platformId, platformType],
  )).rows[0].step;
}

async function setStep({ platformId, platformType, value }) {
  await client.query(
    `UPDATE users SET step = $1  
        WHERE platform_id = $2 and platform_type = $3`,
    [value, platformId, platformType],
  );
  return true;
}

async function getLocation({ platformId, platformType }) {
  return (await client.query(
    `SELECT location FROM users 
        WHERE platform_id = $1 and platform_type = $2`,
    [platformId, platformType],
  )).rows[0].location;
}

module.exports = {
  create,
  changeActivity,
  getActivityStatus,
  findUsersInRequestRadius,
  badRequestCount,
  getTimeOfLastRequest,
  updateBadRequestCountToZero,
  getId,
  getName,
  setName,
  getPlatformId,
  getPlatformTypeFromRequest,
  getStep,
  setStep,
  getLocation,
};
