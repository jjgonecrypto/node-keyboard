'use strict'

const teoria = require('teoria')
const objectify = require('./objectify')
const instruments = require('./instruments')

exports.play = chunk => {
    chunk = objectify(chunk)
    try {
        return instruments.play(chunk)
    } catch (e) {
        throw new Error(`Cannot parse note "${chunk.input}"\n`)
    }
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
    const all = args.reduce((memo, cur) => {
        return memo.concat(cur)
    }, [])
    return chunk => {
        chunk = objectify(chunk)
        return all.map(int => teoria.note(chunk.input).interval(int).toString())
    }
}

exports.instruments = instruments.all

exports.chord = function(input) {
    try {
        const chord = teoria.chord(input)

        return chord.notes().map(n => n.toString())
    } catch (err) {
        throw new Error(`Cannot find chord "${input}"\n`)
    }
}

exports.scale = function(note, scaleName) {
    try {
        const scale = teoria.scale(note, scaleName)
        return scale.notes().map(n => n.toString())
    } catch (err) {
        throw new Error(`Cannot find scale "${note}" "${scaleName}"`)
    }
}

exports.scales = teoria.Scale.KNOWN_SCALES
