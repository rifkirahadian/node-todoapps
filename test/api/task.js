process.env.NODE_ENV = 'test';

const expect = require('chai').expect
const Task = require('../../modules/task')
const mockKnex = require('mock-knex')
const tracker = mockKnex.getTracker()
const task = new Task
const moment = require("moment")

tracker.install();

describe('POST /Create Task (success)', () => {
  it('get date and time from task sentence', async () => {
    let taskSentence = 'join wedding party at Raffles this Saturday at 9pm'
    let {day, time} = task.getDateAndTimeFromTaskSentence(taskSentence)

    expect(day).to.equal('this saturday')
    expect(time).to.equal('9pm')
  })

  it('get name and place from task sentence', async () => {
    let taskSentence = 'join wedding party at Raffles this Saturday at 9pm'
    let {day, time} = task.getDateAndTimeFromTaskSentence(taskSentence)
    let {name, place} = task.getTaskNameAndPlaceFromTaskSentence(taskSentence, day, time)

    expect(name).to.equal('join wedding party')
    expect(place).to.equal('raffles')
  })

  it('day character convert to date format', async () => {
    let day = 'this saturday'
    let dateActual = moment().startOf('isoWeek').day('saturday').format('YYYY-MM-DD')
    let dateShouldAppear = task.dayCharacterConvert(day, {})

    expect(dateShouldAppear).to.equal(dateActual)
  })

  it('time character convert to time format', async () => {
    let time = '9pm'
    timeShouldAppear = task.timeCharacterConvert(time)

    expect(timeShouldAppear).to.equal('21:00:00')
  })
})