const daysName = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

// let [months, monthsNumber] = [[], {}]

let daysWordPossible = ['tomorrow']
daysName.forEach(item => {
    daysWordPossible.push(`this ${item}`)
    daysWordPossible.push(`next ${item}`)
})

module.exports = {daysName, daysWordPossible}