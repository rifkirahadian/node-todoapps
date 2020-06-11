// model for users table
const knex = require('../configs/knex')
const bookshelf = require('bookshelf')(knex)
var ModelBase = require('bookshelf-modelbase')(bookshelf);
bookshelf.plugin(require('bookshelf-modelbase').pluggable);

const User = bookshelf.model('User', {
  tableName: 'users'
})

module.exports = User