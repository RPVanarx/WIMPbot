exports.up = knex => {
  return knex.schema.withSchema('public').createTable('users', table => {
    table.increments();
    table.string('platformId', 50).notNullable();
    table.string('platformType', 10).notNullable();
    table.string('username', 30);
    table.specificType('location', 'POINT').notNullable();
    table.integer('badRequests').defaultTo(0);
    table.boolean('active').defaultTo(true);
    table.specificType('step', 'SMALLINT').defaultTo(0);
    table.timestamp('created').defaultTo(knex.fn.now());
    table.unique(['platformId', 'platformType']);
  });
};

exports.down = knex => {
  return knex.schema.withSchema('public').dropTableIfExists('users');
};
