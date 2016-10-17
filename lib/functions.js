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

exports.every = function(interval) {
    return (input, i) => {
        return {
            instrument: typeof input === 'object' ? input.instrument : this.currentInstrument,
            note: typeof input === 'object' ? input.note : input,
            interval: interval * i
        }
    }
}

exports.play = function(input) {
    const log = function(response) {
        console.log(chalk.gray(response))
    }

    const currentInstrument = this ? this.currentInstrument : 'acoustic_grand_piano'

    try {
        if (typeof input === 'object') {
            const play = () => {
                log(instruments.get(currentInstrument).play(input.note, input.instrument))
            }

            if (input.interval >= 0) setTimeout(play, input.interval)
            else play()

        } else {
            log(instruments.get(currentInstrument).play(input))
        }

    } catch (err) {
        console.error(chalk.red(err))
    }

    return input
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
