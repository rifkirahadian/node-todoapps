const moment = require('moment')

const daysName = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

let timeLength = {
  unit : ['sec', 'second', 'mins', 'minutes', 'hours', 'hour'],
  unitValue : ['second', 'second', 'minute', 'minute', 'hour', 'hour']
}

let [months, monthsNumber] = [[], {}]
for (let index = 0; index < 12; index++) {
  let number = index > 8 ? (index+1) : `0${index+1}`
  let date = moment(`2020-${number}-01`)
  let halfMonthName = date.format('MMM').toLowerCase()
  let fullMonthname = date.format('MMMM').toLowerCase()
  months.push(halfMonthName)
  months.push(fullMonthname)
  monthsNumber[halfMonthName] = number
  monthsNumber[fullMonthname] = number
}

let daysWordPossible = ['tomorrow']
daysName.forEach(item => {
  daysWordPossible.push(`this ${item.toLowerCase()}`)
  daysWordPossible.push(`next ${item.toLowerCase()}`)
})

module.exports = { daysName, daysWordPossible, months, monthsNumber, timeLength }