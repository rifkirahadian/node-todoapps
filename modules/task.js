const Task = require('../models/Task')
const appConfigs = require('../configs/times')
const moment = require('moment')
const responser = require('./responser')
const knex = require('../configs/knex')

class TaskModules {
  getTaskNameFromTaskSentence(task) {
    let characters = task.split(' at ')
    return characters[0]
  }

  isValidTimeFormat(char) {
    let validTime = false
    if ((char.indexOf('am') > 0) || (char.indexOf('pm') > 0)) {
      let timeNumber = char.replace('am', '')
      timeNumber = parseInt(timeNumber.replace('pm', ''))
      if (timeNumber) {
        if (timeNumber < 13) {
          validTime = true
        }
      }
    }

    return validTime
  }

  getPlaceAndTimeFromTaskSentence(task, name) {
    let daysWordPossible = appConfigs.daysWordPossible
    let placeTime = task.replace(`${name} at `, "")

    let placesTimes = placeTime.split(' ')
    
    let [place, day, time] = [null, null, null];
    placesTimes.forEach((item, key) => {
      if (daysWordPossible.indexOf(item) >= 0) {
        day = item
      }

      if (((key+1) < placesTimes.length) && (day === null)) {
        let char = `${item} ${placesTimes[key+1]}`
        if (daysWordPossible.indexOf(char) >= 0) {
          day = char
        }
      }

      if (this.isValidTimeFormat(item)) {
        time = item
      }
    })

    let dayIndex = placeTime.indexOf(day)
    let timeIndex = placeTime.indexOf(time)

    if (dayIndex > timeIndex) {
      place = placeTime.substr(0, timeIndex-1)
    }else{
      place = placeTime.substr(0, dayIndex-1)
    }

    return {place, day, time}
  }

  parseTaskSentence(task) {
    let name = this.getTaskNameFromTaskSentence(task)
    let {place, day, time} = this.getPlaceAndTimeFromTaskSentence(task, name)

    return {name, place, day, time}
  }

  dayCharacterConvert(day, res) {
    switch (day) {
      case 'tomorrow':
        return moment().add(1, 'day').format('YYYY-MM-DD')
      break;
    
      default:
        let today = moment().format('YYYY-MM-DD')
        let timeType = day.substr(0,4)
        let dayName = day.replace(`${timeType} `, '')

        switch (timeType) {
          case 'this':
            let date = moment().startOf('isoWeek').day(dayName).format('YYYY-MM-DD')
            if (moment(today).isAfter(date)) {
              throw responser.errorResponse(res, `You set the wrong day, ${dayName} has passed`)
            }

            return date
          break;

          case 'next' : 
            return moment().startOf('isoWeek').add(1, 'week').day(dayName).format('YYYY-MM-DD')
          break;
            
          default: break;
        }
      break;
    }

    return null
  }

  timeCharacterConvert(time) {
    if (time.indexOf('am') > 0) {
      var timeNumber = parseInt(time.replace('am'))
    }else{
      var timeNumber = parseInt(time.replace('pm')) + 12
    }

    return `${timeNumber}:00:00`
  }

  async getUpcomingTasksDate(user_id) {
    const today = moment().format('YYYY-MM-DD')
    let tasksDate = await knex('tasks').where({user_id}).where('date', '>=', today).select('date').groupBy('date')
    
    return tasksDate.map(item => {
      return moment(item.date).format('YYYY-MM-DD')
    })
  }

  async getUpcomingTasksByDate(tasksDate, user_id) {
    const today = moment().format('YYYY-MM-DD')
    
    let tasksQuery = tasksDate.map(item => {
      return Task.where({user_id, date:item}).get()
    })

    let tasks = await Promise.all(tasksQuery)
    return tasks.map((item, key) => {
      item = item.toJSON()

      return {
        date: moment(tasksDate[key]).format('MMM DD, YYYY'),
        tasks: item.map(task => {
          return `@${moment(`${today} ${task.start_time}`).format('ha')}, ${task.place}, ${task.name}`
        })
      }
    })
  }

  async getUpcomingTasksPlaces(user_id) {
    const today = moment().format('YYYY-MM-DD')
    let tasksPlace = await knex('tasks').where({user_id}).where('date', '>=', today).select('place').groupBy('place')
    
    return tasksPlace.map(item => {
      return item.place
    })
  }

  async getUpcomingTasksByPlace(tasksPlace, user_id) {
    let tasksQuery = tasksPlace.map(item => {
      return Task.where({user_id, place:item}).get()
    })

    let tasks = await Promise.all(tasksQuery)
    return tasks.map((item, key) => {
      item = item.toJSON()

      return {
        place: tasksPlace[key],
        tasks: item.map(task => {
          let date = moment(task.date).format('YYYY-MM-DD')
          return `${moment(`${date} ${task.start_time}`).format('MMM DD, YYYY @ha')}, ${task.name}`
        })
      }
    })
  }

  async clashTaskValidate(date, start_time, user_id, res) {
    try {
      let task = await Task.where({date, start_time, user_id}).first()
      if (task) {
        task = task.toJSON()
        throw responser.errorResponse(res, `Your task clashes with ${task.name}`)
      }
    } catch (error) {
      
    }
    
  }
}

module.exports = TaskModules