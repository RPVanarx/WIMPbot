exports.up = knex => {
  return knex.schema
    .withSchema('public')
    .raw('CREATE EXTENSION IF NOT EXISTS cube')
    .raw('CREATE EXTENSION IF NOT EXISTS earthdistance');
};

exports.down = knex => {
  return knex.schema
    .withSchema('public')
    .raw('DROP EXTENSION IF EXISTS earthdistance')
    .raw('DROP EXTENSION IF EXISTS cube');
};
