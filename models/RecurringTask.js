// model for tasks table
const knex = require('../configs/knex')
const bookshelf = require('bookshelf')(knex)
bookshelf.plugin(require('bookshelf-modelbase').pluggable);
bookshelf.plugin(require('bookshelf-eloquent'));

const RecurringTask = bookshelf.model('RecurringTask', {
  tableName: 'recurring_tasks'
})

module.exports = RecurringTask