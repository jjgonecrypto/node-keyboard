'use strict'

const chalk = require('chalk')
const teoria = require('teoria')
const objectify = require('./objectify')
const instruments = require('./instruments')
const piano = require('./piano')

exports.play = chunk => {
    chunk = objectify(chunk)
    try {
        return instruments.play(chunk)
    } catch (e) {
        console.error(`Cannot parse note "${chunk.input}"`)
        return chunk
    }
}

exports.piano = chunk => {
    chunk = objectify(chunk)

    return piano.draw(chunk.input)
}

exports.instrument = instrument => {
    instrument = instrument || instruments.random
    return chunk => {
        chunk = objectify(chunk)
        chunk.instrument = instruments.findByName(instrument)
        return chunk
    }
}

exports.log = chunk => {
    chunk = objectify(chunk)
    process.stdout.write(`${chalk.gray(chunk.played || chunk.input)}\n`)
    return chunk
}

exports.interval = (...args) => {
    const all = [].concat(...args)
    return chunk => {
        chunk = objectify(chunk)
        const note = typeof chunk.input === 'number' ? teoria.note.fromMIDI(chunk.input) : teoria.note(chunk.input)
        return all.map(int => note.interval(int).toString())
    }
}

exports.instruments = instruments.all

exports.chord = input => {
    try {
        const chord = teoria.chord(input)

        return chord.notes().map(n => n.toString())
    } catch (err) {
        console.error(`Cannot find chord "${input}"`)
        return []
    }
}

exports.scale = (note, scaleName) => {
    try {
        const scale = teoria.scale(note, scaleName)
        return scale.notes().map(n => n.toString())
    } catch (err) {
        console.error(`Cannot find scale "${note}" "${scaleName}"`)
        return []
    }
}

exports.scales = teoria.Scale.KNOWN_SCALES

exports.only = (...args) => {
    args = [].concat(...args)
    return (note, i) => {
        return args.indexOf(i + 1) > -1
    }
}

exports.sequence = (note, ...seq) => {
    seq = [].concat(...seq)
    try {
        return seq.reduce((acc, semitones, i) => {
            const prevNoteNumber = teoria.note(acc[i]).midi()
            return acc.concat(teoria.note.fromMIDI(prevNoteNumber + semitones).toString())
        }, [teoria.note(note).toString()])
    } catch (e) {
        console.error(`Cannot find sequence starting note "${note}"`)
        return []
    }
}
