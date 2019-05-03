const knex = require('./knex');

const { distance, knexHelper: helper } = require('../utils');

const REQUESTS = 'requests';

module.exports = {
  async create({ userId, requestType, longitude, latitude, photo, message }) {
    const results = await knex(REQUESTS)
      .insert({
        userId,
        requestType,
        location: helper.toPoint({ longitude, latitude }),
        photo,
        message,
      })
      .returning(['id', 'created']);
    return results[0];
  },

  update({ id, active, approved, moderatedBy }) {
    return knex(REQUESTS)
      .update({ active, approved, moderatedBy })
      .where({ id })
      .returning('id');
  },

  get(id) {
    return knex(REQUESTS)
      .where({ id })
      .first();
  },

  getLastRequest({ userId }) {
    return knex(REQUESTS)
      .where({ userId })
      .orderBy('created', 'desc')
      .first();
  },

  getUserRequests(ownerId) {
    return knex(REQUESTS).where({ userId: ownerId, active: true });
  },

  getInArea({ location, radius, days }) {
    const radiusMi = distance.metersToMiles(radius);
    return knex({ r: REQUESTS })
      .join('users as u', { 'r.userId': 'u.id' })
      .where({ 'r.active': true })
      .andWhereRaw('r.location <@> point(?, ?) <= ?', [location.x, location.y, radiusMi])
      .andWhereRaw(`r.created >= (now() AT TIME ZONE 'UTC' - ? * interval '1 day')`, [days])
      .select(
        'r.id',
        'r.requestType',
        'r.photo',
        'r.message',
        'r.created',
        'r.location',
        'u.username',
        'u.platformType',
      );
  },
};
