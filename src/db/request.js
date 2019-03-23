const dbconnect = require('../dbconnect');

let client;
dbconnect.then(res => {
  client = res;
});

async function create(request) {
  await client.query(
    `UPDATE users SET user_name = $1, bad_request_count = bad_request_count + 1 
    WHERE platform_id = $2 AND platform_type = $3`,
    [request.userName, request.platformId, request.platformType],
  );

  return (await client.query(
    `INSERT INTO requests VALUES(
        DEFAULT,
        (SELECT id FROM users WHERE platform_id = $1 AND platform_type = $2), 
        $3, 
        (point($4, $5)), 
        $6, 
        $7, 
        now()) 
        RETURNING id`,
    [
      request.platformId,
      request.platformType,
      request.requestType,
      request.longitude,
      request.latitude,
      request.photo,
      request.message,
    ],
  )).rows[0].id;
}

async function getRequestsToDelete({ platformId, platformType }) {
  return (await client.query(
    `SELECT id, photo, message FROM requests 
    WHERE user_id = (SELECT id FROM users WHERE platform_id = $1 AND platform_type = $2) 
    AND is_active = true`,
    [platformId, platformType],
  )).rows;
}

async function deleteRequest(id) {
  await client.query('UPDATE requests SET is_active = false WHERE id = $1', [id]);
  return true;
}

async function search({ platformId, platformType, radius, days }) {
  return (await client.query(
    `SELECT r.id, r.request_type, r.photo, r.message, r.creation_date, r.location, u.user_name, u.platform_type 
    FROM requests AS r, users AS u 
    WHERE ((SELECT location FROM users WHERE platform_id = $1 AND platform_type = $2) <@> r.location) <= $3/1609.34 
    AND u.id = r.user_id 
    AND r.is_active = true 
    AND r.creation_date >= (now() AT TIME ZONE 'UTC' - $4 * interval '1 day')`,
    [platformId, platformType, radius, days],
  )).rows;
}

async function searchInArea({ longitude, latitude, radius, days }) {
  return (await client.query(
    `SELECT r.id, r.request_type, r.photo, r.message, r.creation_date, u.user_name, u.platform_type 
    FROM requests AS r, users AS u 
    WHERE (point($1, $2) <@> r.location) <= $3/1609.34 
    AND u.id = r.user_id 
    AND r.is_active = true 
    AND r.creation_date >= (now() AT TIME ZONE 'UTC' - $4 * interval '1 day')`,
    [longitude, latitude, radius, days],
  )).rows;
}

async function changeActiveStatus({ reqId, status, moderatorId }) {
  const request = (await client.query(
    `UPDATE requests SET is_approved = $2, is_active = $2, status_changed_by = $3 
    WHERE id = $1 RETURNING *`,
    [reqId, status, moderatorId],
  )).rows[0];
  const userReq = (await client.query(
    `SELECT user_name, platform_type, platform_id FROM users 
    WHERE id = $1`,
    [request.user_id],
  )).rows[0];
  if (!status) return Object.assign(request, userReq);
  await client.query(
    `UPDATE users SET bad_request_count = bad_request_count - 1 
    WHERE id = $1`,
    [request.user_id],
  );
  return Object.assign(request, userReq);
}

module.exports = {
  create,
  getRequestsToDelete,
  deleteRequest,
  search,
  searchInArea,
  changeActiveStatus,
};
