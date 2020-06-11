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
      let user_id = req.user.id

      let {day, time, place, name} = await taskModules.parseTaskSentence(task)
      let date = taskModules.dayCharacterConvert(day, res)
      time = taskModules.timeCharacterConvert(time)
      
      await Task.create({
        name, 
        place, 
        date, 
        start_time:time, 
        user_id, 
        words:task
      })

      return responser.successResponse(res, null, 'Task Created')
    } catch (error) {
      return responser.errorResponseHandle(error, res)
    }
  }

  async upcomingTask(req, res) {
    try {
      let user = req.user
      let {queriedBy} = req.query

      if (queriedBy == 'location') {
        let tasksPlace = await taskModules.getUpcomingTasksPlaces(user.id)
        var tasks = await taskModules.getUpcomingTasksByPlace(tasksPlace, user.id)
      }else{
        let tasksDate = await taskModules.getUpcomingTasksDate(user.id)
        var tasks = await taskModules.getUpcomingTasksByDate(tasksDate, user.id)
      }

      return responser.successResponse(res, tasks, null)
    } catch (error) {
      return responser.errorResponseHandle(error, res)
    }
  }
}

module.exports = TaskController