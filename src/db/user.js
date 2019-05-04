const knex = require('./knex');

const { distance, knexHelper: helper } = require('../utils');

const {
  defaultValues: { RADIUS },
} = require('../config');

const USERS = 'users';
const RADIUS_MI = distance.metersToMiles(RADIUS);

module.exports = {
  async create({ platformId, platformType, longitude, latitude, username }) {
    const ids = await knex(USERS)
      .insert({
        platformId,
        platformType,
        location: helper.toPoint({ longitude, latitude }),
        username,
      })
      .returning('id');
    return ids[0];
  },

  get({ id, platformId, platformType }) {
    return knex(USERS)
      .where(builder => {
        if (id) return builder.where({ id });

        return builder.where({ platformId, platformType });
      })
      .first();
  },

  update({
    id,
    platformId,
    platformType,
    username,
    longitude,
    latitude,
    badRequests,
    active,
    step,
  }) {
    return knex(USERS)
      .where(builder => {
        if (id) return builder.where({ id });

        return builder.where({ platformId, platformType });
      })
      .update({
        username,
        location: helper.toPoint({ longitude, latitude }),
        badRequests,
        active,
        step,
      })
      .returning('id');
  },

  async getUsersInRadius(location) {
    return knex(USERS)
      .where({ active: true })
      .andWhereRaw('location <@> point(?, ?) <= ?', [location.x, location.y, RADIUS_MI]);
  },
};
