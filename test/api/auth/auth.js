process.env.NODE_ENV = 'test';

const expect = require('chai').expect
const Auth = require('../../../modules/auth')
const mockKnex = require('mock-knex');
const tracker = mockKnex.getTracker();
const auth = new Auth

const {users} = require('../../data/auth')
tracker.install();

describe('POST /Login', () => {
  before(() => {
    tracker.on('query', (query) => {
      const results = users;
      query.response(results);
    });
  });

  it('get user from username', async () => {
    let user = await auth.getUserFromUsername('rifki', {})
      
    expect(user).to.have.property('username', 'rifki')
  });
})