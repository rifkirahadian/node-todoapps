process.env.NODE_ENV = 'test';

const expect = require('chai').expect
const Auth = require('../../../modules/auth')
const mockKnex = require('mock-knex');
const tracker = mockKnex.getTracker();
const auth = new Auth
const bcrypt = require("bcrypt-nodejs")

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
  })

  it('validate user password', async () => {
    let password = bcrypt.hashSync('123')
    let validatePassword = await auth.validatePasswordLogin(password, '123', {})
      
    expect(validatePassword).to.equal(true);
  })

  it('get auth token', async () => {
    let user = users[0]
    let token = auth.generateAuthToken(user)
      
    expect(token).to.be.a('string')
  })
})