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

exports.instrument = (chunk, instrument) => {
    instrument = instrument || instruments.random

    chunk = objectify(chunk)
    chunk.instrument = instruments.findByName(instrument)

    return chunk
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
