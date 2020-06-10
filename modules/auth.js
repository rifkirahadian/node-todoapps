const User = require('../models/User')
const responser = require('./responser')
const bcrypt = require("bcrypt-nodejs")

class Auth {
    async setRegister(username, name, password, res) {
        try {
            password = bcrypt.hashSync(password)
            
            await new User({ name, username, password }).save()
        } catch (error) {
            throw responser.errorResponse(res, error.sqlMessage)
        }
    }
}

module.exports = Auth