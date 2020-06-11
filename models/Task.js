// model for tasks table
const knex = require('../configs/knex')
const bookshelf = require('bookshelf')(knex)
bookshelf.plugin(require('bookshelf-modelbase').pluggable);
bookshelf.plugin(require('bookshelf-eloquent'));

const Task = bookshelf.model('Task', {
  tableName: 'tasks'
})

module.exports = Task