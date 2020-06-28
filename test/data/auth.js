const bcrypt = require("bcrypt-nodejs")

const users = [
  {
    id: 1,
    username: 'rifki',
    name: 'A',
    password: bcrypt.hashSync('123')
  },
  {
    id: 2,
    username: 'B',
    name: 'B',
    password: bcrypt.hashSync('123')
  },
  {
    id: 3,
    username: 'C',
    name: 'C',
    password: bcrypt.hashSync('123')
  }
]

module.exports = {users}