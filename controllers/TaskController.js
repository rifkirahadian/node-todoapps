const TaskModules = require('../modules/task')
const responser = require('../modules/responser')
const validator = require('../modules/validator')
const Task = require('../models/Task')

const taskModules = new TaskModules

class TaskController {
  async createTask(req, res) {
    try {
      validator.formValidate(req, res)
      let {task} = req.body

      let {day, time, place, name} = await taskModules.parseTaskSentence(task)
      let date = taskModules.dayCharacterConvert(day, res)
      time = taskModules.timeCharacterConvert(time)
      
      await Task.create({
        name, 
        place, 
        date, 
        start_time:time, 
        user_id: req.user.id, 
        words:task
      })

      return responser.successResponse(res, null, 'Task Created')
    } catch (error) {
      return responser.errorResponseHandle(error, res)
    }
  }
}

module.exports = TaskController