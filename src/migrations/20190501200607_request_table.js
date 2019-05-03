exports.up = knex => {
  return knex.schema.withSchema('public').createTable('requests', table => {
    table.increments();
    table
      .integer('userId')
      .unsigned()
      .notNullable();
    table.foreign('userId').references('users.id');

    table.string('requestType', 10).notNullable();
    table.specificType('location', 'POINT').notNullable();
    table.string('photo', 100).notNullable();
    table.text('message').notNullable();
    table
      .boolean('approved')
      .defaultTo(false)
      .notNullable();

    table.integer('moderatedBy').unsigned();
    table.foreign('moderatedBy').references('users.id');

    table.boolean('active').defaultTo(false);
    table.timestamp('created').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.withSchema('public').dropTableIfExists('requests');
};
