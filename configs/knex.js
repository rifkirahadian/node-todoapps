let environment = process.env.NODE_ENV
let config = require('../knexfile')[environment]

module.exports = require('knex')(config)