'use strict'

const teoria = require('teoria')
const objectify = require('./objectify')
const instruments = require('./instruments')
const piano = require('./piano')

exports.play = chunk => {
    chunk = objectify(chunk)
    try {
        return instruments.play(chunk)
    } catch (e) {
        throw new Error(`Cannot parse note "${chunk.input}"\n`)
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

exports.interval = (...args) => {
    const all = [].concat(...args)
    return chunk => {
        chunk = objectify(chunk)
        return all.map(int => teoria.note(chunk.input).interval(int).toString())
    }
}

exports.instruments = instruments.all

exports.chord = input => {
    try {
        const chord = teoria.chord(input)

        return chord.notes().map(n => n.toString())
    } catch (err) {
        throw new Error(`Cannot find chord "${input}"\n`)
    }
}

exports.scale = (note, scaleName) => {
    try {
        const scale = teoria.scale(note, scaleName)
        return scale.notes().map(n => n.toString())
    } catch (err) {
        throw new Error(`Cannot find scale "${note}" "${scaleName}"`)
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
    return seq.reduce((acc, semitones, i) => {
        const prevNoteNumber = teoria.note(acc[i]).midi()
        return acc.concat(teoria.note.fromMIDI(prevNoteNumber + semitones).toString())
    }, [teoria.note(note).toString()])

}
