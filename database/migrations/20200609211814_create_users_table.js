// users table
exports.up = function (knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id')
      table.string('username', 100).notNullable().unique()
      table.string('name', 150).notNullable()
      table.string('password', 80).notNullable()
      table.timestamps()
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable('users')
};
