
exports.up = function (knex) {
  return knex.schema
    .createTable('tasks', function (table) {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users')
      table.string('name', 150).notNullable()
      table.string('place', 150)
      table.date('date').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time')
      table.text('words').notNullable()
      table.timestamps()
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable('tasks')
};
