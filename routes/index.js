const AuthController = require('../controllers/AuthController')

const validator = require('../modules/validator')

const authController = new AuthController

module.exports = (app, express) => {
  const apiRoutes = express.Router()

  apiRoutes.post('/register', authController.register)

  app.use('/api',validator.register, apiRoutes)
}