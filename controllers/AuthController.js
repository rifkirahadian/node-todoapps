const validator = require('../modules/validator')
const responser = require('../modules/responser')
const Auth = require('../modules/auth')
    
const auth = new Auth

class AuthController {
  async register(req, res) {
    try {
      validator.formValidate(req, res)
      let { username, name, password } = req.body

      await auth.setRegister(username, name, password, res)

      return responser.successResponse(res, null, 'Register Success')
    } catch (error) {
      return responser.errorResponseHandle(error, res)
    }
  }

  async login(req, res) {
    try {
      validator.formValidate(req, res)
      let { username, password } = req.body

      let user = await auth.getUserFromUsername(username, res)
      await auth.validatePasswordLogin(user.password, password, res)
      let token = auth.generateAuthToken(user)

      return responser.successResponse(res, token, 'Login Success')
    } catch (error) {
      return responser.errorResponseHandle(error, res)
    }
  }
}

module.exports = AuthController