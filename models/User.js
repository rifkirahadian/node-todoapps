// model for users table
const knex = require('../configs/knex')
const bookshelf = require('bookshelf')(knex)
var ModelBase = require('bookshelf-modelbase')(bookshelf);
bookshelf.plugin(require('bookshelf-modelbase').pluggable);

const User = ModelBase.extend({
  tableName: 'users',
});

module.exports = User