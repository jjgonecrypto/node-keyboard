'use strict'

const chalk = require('chalk')
const teoria = require('teoria')

const instruments = require('./instruments')

exports.using = function(instrument) {
    return input => {
        return {
            instrument: instruments.findByName(instrument) || this.currentInstrument,
            note: typeof input === 'object' ? input.note : input,
            interval: typeof input === 'object' ? input.interval : -1
        }
    }
}

exports.chord = function(input) {
    try {
        const chord = teoria.chord(input)
        console.log(chalk.gray(chord.toString()))

        return chord.notes().map(n => n.toString())
    } catch (err) {
        console.error(chalk.red(`cannot find chord "${input}"`))
        return []
    }
}

exports.scale = function(note, scaleName) {
    try {
        const scale = teoria.scale(note, scaleName)
        return scale.notes().map(n => n.toString())
    } catch (err) {
        console.error(chalk.red(`cannot find scale "${note}" "${scaleName}"`))
        return []
    }
}
