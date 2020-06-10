const User = require('../models/User')
const responser = require('./responser')
const bcrypt = require("bcrypt-nodejs")
const jwt = require("jsonwebtoken")

class Auth {
    async setRegister(username, name, password, res) {
        try {
            password = bcrypt.hashSync(password)

            await User.create({ name, username, password })
        } catch (error) {
            throw responser.errorResponse(res, error.sqlMessage)
        }
    }

    async getUserFromUsername(username, res) {
        try {
            let user = await User.findOne({username})
            return user.toJSON()
        } catch (error) {
            throw responser.errorResponseStatus(res,401, `Username '${username}' not found`)
        }
    }

    async validatePasswordLogin(userPassword, passwordInput, res) {
        if (!bcrypt.compareSync(passwordInput, userPassword)) {
            throw responser.errorResponseStatus(res, 401, 'Wrong Password')
        }
    }

    generateAuthToken(user) {
        return jwt.sign(user, 'superSecret', {
            expiresIn: 1000000*1440 
        })


    }
}

module.exports = Auth