const Task = require('../models/Task')
const appConfigs = require('../configs/times')
const moment = require('moment')
const responser = require('./responser')

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
            
          default:
            break;
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
}

module.exports = TaskModules