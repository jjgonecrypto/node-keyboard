'use strict';

const chalk = require('chalk')
const teoria = require('teoria')

const instruments = require('./instruments')

exports.using = function(instrument) {
    return note => {
        return {
            instrument: instruments.findByName(instrument) || this.currentInstrument,
            note
        }
    }
}

exports.play = function(input) {
    let response

    try {
        if (typeof input === 'object') {
            response = instruments.get(this.currentInstrument).play(input.note, input.instrument)
        } else {
            response = instruments.get(this.currentInstrument).play(input)
        }
        console.log(chalk.gray(response))
    } catch (err) {
        console.error(chalk.red(err))
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

