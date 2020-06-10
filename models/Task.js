// model for tasks table
const knex = require('../configs/knex')
const bookshelf = require('bookshelf')(knex)
var ModelBase = require('bookshelf-modelbase')(bookshelf);
bookshelf.plugin(require('bookshelf-modelbase').pluggable);

const Task = ModelBase.extend({
  tableName: 'tasks',
});

module.exports = Task