const createKnex = require('knex');

const knexfile = require('../knexfile');

const config = process.env.NODE_ENV === 'production' ? knexfile.production : knexfile.development;

const knex = createKnex(config);

module.exports = knex;
