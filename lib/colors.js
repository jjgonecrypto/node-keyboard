'use strict'

const COLORS = ['green', 'yellow', 'blue', 'magenta', 'cyan']
module.exports = {
    getAt(i) {
        return COLORS[i % (COLORS.length - 1)]
    },
    getRandom(last) {
        let randomIndex = Math.floor(Math.random() * COLORS.length)
        if (COLORS[randomIndex] === last) randomIndex = (randomIndex + 1) % COLORS.length
        return COLORS[randomIndex]
    }
}
