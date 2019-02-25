const user = require('../dbconnect');

async function create(request) {
  await user.query(
    'UPDATE users SET user_name = $1, bad_request_count = bad_request_count + 1 WHERE platform_id = $2 AND platform_type = $3',
    [request.userName, request.platformId, request.platformType],
  );

  return (await user.query(
    'INSERT INTO requests VALUES(DEFAULT,(SELECT id FROM users WHERE platform_id = $1 AND platform_type = $2), $3, (point($4, $5)), $6, $7, now()) RETURNING id',
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
    "SELECT r.id, r.request_type, r.photo, r.message, r.creation_date, u.user_name, u.platform_type FROM requests AS r, users AS u WHERE ((SELECT location FROM users WHERE platform_id = $1 AND platform_type = $2) <@> r.location) <= $3/1609.34 AND u.id = r.user_id AND r.is_active = true AND r.creation_date >= (now() AT TIME ZONE 'UTC' - $4 * interval '1 day')",
    [platformId, platformType, radius, days],
  )).rows;
}

async function changeActiveStatus(reqId, value, moderatorId) {
  const request = (await user.query(
    'UPDATE requests SET is_approved = $2, is_active = $2, status_changed_by = $3 WHERE id = $1 RETURNING *',
    [reqId, value, moderatorId],
  )).rows[0];

  await user.query('UPDATE users SET bad_request_count = bad_request_count - 1 WHERE id = $1', [
    request.user_id,
  ]);

  const userReq = (await user.query('SELECT user_name, platform_type FROM users WHERE id = $1', [
    request.user_id,
  ])).rows[0];
  return Object.assign(request, userReq);
}

module.exports = {
  create,
  findToDelete,
  deleteRequest,
  search,
  changeActiveStatus,
};
