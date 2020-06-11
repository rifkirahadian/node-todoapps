const AuthController = require('../controllers/AuthController')
const TaskController = require('../controllers/TaskController')
const validator = require('../modules/validator')

const authController = new AuthController
const taskController = new TaskController

module.exports = (app, express) => {
  const apiRoutes = express.Router()
  const authRoutes = express.Router()

  //middleware
  require('../middlewares/Auth')(authRoutes)

  apiRoutes.post('/register',validator.register, authController.register)
  apiRoutes.post('/login',validator.login, authController.login)

  authRoutes.post('/task', validator.createTask, taskController.createTask)

  app.use('/api', apiRoutes)
  app.use('/api', authRoutes)
}