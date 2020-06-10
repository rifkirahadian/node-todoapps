const AuthController = require('../controllers/AuthController')

const validator = require('../modules/validator')

const authController = new AuthController

module.exports = (app, express) => {
  const apiRoutes = express.Router()

  apiRoutes.post('/register',validator.register, authController.register)
  apiRoutes.post('/login',validator.login, authController.login)

  app.use('/api', apiRoutes)
}