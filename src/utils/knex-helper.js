const knex = require('../db/knex');

function toPoint({ longitude, latitude }) {
  if (longitude == null && latitude == null) return undefined;

  return knex.raw(`point(${longitude}, ${latitude})`);
}

module.exports = {
  toPoint,
};
