// knex configuration settting
const mockDb = require('mock-knex');
const environment = process.env.NODE_ENV
const config = require('../knexfile')[environment]
const knex = require('knex')(config)

module.exports = environment === 'test' ? mockDb.mock(knex, 'knex@0.10') : knex