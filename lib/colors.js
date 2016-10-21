'use strict'

const shuffle = require('lodash.shuffle')

const COLORS = ['green', 'yellow', 'blue', 'magenta', 'cyan', 'red']

module.exports = {
    getAt(i) {
        return COLORS[i % (COLORS.length - 1)]
    },
    getRandom(last) {
        return shuffle(COLORS.filter(c => c !== last))[0]
    }
}
