const Task = require('../models/Task')
const timeConfig = require('../configs/times')
const wordConfig = require('../configs/words')
const moment = require('moment')
const responser = require('./responser')
const knex = require('../configs/knex')
const RecurringTask = require('../models/RecurringTask')

class TaskModules {
  getTaskNameAndPlaceFromTaskSentence(task, day, time) {
    let newSentence = task.toLowerCase().replace(day, '')
    newSentence = newSentence.replace(time, '')

    let [name, place] = [null, null]
    const {conjunctions} = wordConfig

    conjunctions.forEach(item => {
      let characters = newSentence.split(` ${item} `)
      if (characters.length > 1) {
        name = characters[0]
        place = characters[1]
      }
    })
    
    name = (name === null ? newSentence : name).trim()

    return {name, place}
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

  getPlaceAndTimeFromTaskSentence(placeTime) {
    let daysWordPossible = timeConfig.daysWordPossible

    let sentences = placeTime.split(' ')
    
    let [day, time] = [null, null, null];
    sentences.forEach((item, key) => {
      if (daysWordPossible.indexOf(item.toLocaleLowerCase()) >= 0) {
        day = item.toLocaleLowerCase()
      }

      if (((key+1) < sentences.length) && (day === null)) {
        let char = `${item} ${sentences[key+1]}`
        if (daysWordPossible.indexOf(char.toLowerCase()) >= 0) {
          day = char.toLowerCase()
        }
      }

      if (this.isValidTimeFormat(item)) {
        time = item
      }
    })

    return {day, time}
  }

  parseTaskSentence(task) {
    let {day, time} = this.getPlaceAndTimeFromTaskSentence(task)
    let {name, place} = this.getTaskNameAndPlaceFromTaskSentence(task, day, time)

    return {name, day, time, place}
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

    timeNumber = timeNumber > 9 ? timeNumber : `0${timeNumber}`

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
    let task = await Task.where({date, start_time, user_id}).first()
    if (task) {
      task = task.toJSON()
      throw responser.errorResponse(res, `Your task clashes with ${task.name}`)
    }
  }

  checkDateExistOnSentence(task) {
    let {monthsNumber, months} = timeConfig
    
    let taskWords = task.split(' ')
    let day = null
    let month = null
    taskWords.forEach((item, key) => {
      if (months.indexOf(item.toLowerCase()) >= 0) {
        month = item.toLowerCase()
      }

      if ((month !== null) && (key > 0) &&(day === null)) {
        let date = parseInt(taskWords[key-1])
        if (date) {
          day = date
        }
      }
    })

    if (day !== null) {
      let dateWord = `${day} ${month}`
      month = monthsNumber[month]

      return {month, day, dateWord}
    }else{
      return null
    }
  }

  getTaskNameRecurringTaskDate(task, dateWord) {
    task = task.replace(dateWord, '')
    task = this.removeConjuntionFromSentence(task)

    return task
  }

  removeConjuntionFromSentence(word) {
    const {conjunctions} = wordConfig
    conjunctions.forEach(element => {
      word = word.replace(` ${element} `, '')
    })

    return word
  }

  async createRecurringTaskDateType(dateObject, name, user_id, words) {
    let date = `2020-${dateObject.month}-${dateObject.day}`
    let type = 'every_year'
    let start_time = null
    let end_time = null

    let recurringTask = await RecurringTask.create({
      user_id, name, words, date, type, start_time, end_time
    })

    return recurringTask.toJSON()
  }

  getNextDateTaskRecurring(date, type) {
    const today = moment().format('YYYY-MM-DD')

    switch (type) {
      case 'every_year':
        var timeUnit = 'year'
      break;

      case 'every_day':
      var timeUnit = 'day'
      break;
    
      default:
        var timeUnit = 'day'
      break;
    }

    if (moment(today).isSameOrAfter(date)) {
      return moment(date).add(1, timeUnit).format('YYYY-MM-DD')
    }else{
      return date
    }
  }

  async setTaskFromRecurring(recurringTask, date) {
    let {user_id, name, words, start_time, end_time} = recurringTask
    await Task.create({
      user_id,
      name,
      words,
      date,
      start_time: start_time ? start_time : '00:00:00',
      end_time,
      recurring_task_id: recurringTask.id
    })
  }

  dailyRecurringTaskCheck(task) {
    let {dailyRecurringTaskWord} = wordConfig
    let taskWords = task.split(' ')
    let isDailyRecurringTask = null

    taskWords.forEach((item, key) => {
      if (dailyRecurringTaskWord.indexOf(item) >= 0) {
        isDailyRecurringTask = true
      }
      
      if (key > 0) {
        let word = `${taskWords[key-1]} ${item}`
        if (dailyRecurringTaskWord.indexOf(word.toLocaleLowerCase()) >= 0) {
          isDailyRecurringTask = word
        }
      }
    });
    
    return isDailyRecurringTask
  }

  timeLengthCheck(task) {
    let {timeLength} = timeConfig
    let taskWords = task.split(' ')
    
    let timeLengthWord = null

    taskWords.forEach((item, key) => {
      if ((timeLength.unit.indexOf(item) >= 0) && (key > 0)) {
        let timeLengthValue = parseInt(taskWords[key-1])
        if (timeLengthValue) {
          timeLengthWord = `${taskWords[key-1]} ${item}`
        }
      }
    })

    return timeLengthWord
  }

  startTimeCheck(task) {
    let taskWords = task.split(' ')
    let time = null
    taskWords.forEach(item => {
      if (this.isValidTimeFormat(item)) {
        time = item
      }
    })

    return time
  }

  getTaskNameRecurringTaskDaily(dailyRecurringWord, timeLength, startTime, task) {
    let dailyRecurringWordIndex = task.indexOf(dailyRecurringWord)
    let timeLengthIndex = task.indexOf(timeLength)
    let startTimeIndex = task.indexOf(startTime)

    let minimumIndex = Math.min.apply(Math, [dailyRecurringWordIndex, timeLengthIndex, startTimeIndex])

    let name = task.substr(0,minimumIndex)
    name = this.removeConjuntionFromSentence(name)
    
    return name
  }

  getEndTimeFromTimeLength(startTime, timeLength) {
    let parseTimeLength = timeLength.split(' ')
    let {unitValue, unit} = timeConfig.timeLength
    let unitIndex = unit.indexOf(parseTimeLength[1])
    let timeUnit = unitValue[unitIndex]

    let endTime = moment(`2020-01-01 ${startTime}`).add(parseTimeLength[0], timeUnit).format('HH:mm:ss')

    return endTime
  }

  async createRecurringTaskDailyType(user_id, name, words, start_time, end_time) {
    let date = moment().format('YYYY-MM-DD')
    let type = 'every_day'
    let recurringTask = await RecurringTask.create({
      user_id, name, words, date, type, start_time, end_time
    })

    return recurringTask.toJSON()
  }

  async updateUpcomingTaskByRows(recurringTask) {
    const today = moment().format('YYYY-MM-DD')
    const now = moment().format('HH:mm:ss')

    try {
      await Task.where({recurring_task_id: recurringTask.id})
        .where(q => {
          q.where('date', '>', today)
          .orWhere(q1 => {
            q1.where({date:today}).where('start_time', '>', now)
          })
        }).first()
    } catch (error) {
      let nextDate = this.getNextDateTaskRecurring(recurringTask.date, recurringTask.type)
      await this.setTaskFromRecurring(recurringTask, nextDate)
    }
  }

  async updateUpcomingTaskOfRecurringTasks() {
    let recurringTasks = await RecurringTask.get()
    recurringTasks = recurringTasks.toJSON()

    let upcomingTasksQueries = recurringTasks.map(item => {
      return this.updateUpcomingTaskByRows(item)
    })

    await Promise.all(upcomingTasksQueries)
  }
}

module.exports = TaskModules