const daysName = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

let daysWordPossible = ['tomorrow']
daysName.forEach(item => {
    daysWordPossible.push(`this ${item}`)
    daysWordPossible.push(`next ${item}`)
})

module.exports = {daysName, daysWordPossible}