const schedule = require('node-schedule')
const Task = require('./task')
const taskModules = new Task

module.exports = function(app){
  //scheduling to make recurring task created when its already passed
  const recurringTaskSchedule = schedule.scheduleJob('0 0 */1 * * *', async() =>{
    await taskModules.updateUpcomingTaskOfRecurringTasks()
  })
}