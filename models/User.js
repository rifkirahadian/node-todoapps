// model for users table
const knex = require('../configs/knex')
const bookshelf = require('bookshelf')(knex)

const User = bookshelf.model('User', {
  tableName: 'users'
})

module.exports = User