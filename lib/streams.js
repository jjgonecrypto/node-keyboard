'use strict'

const Transform = require('stream').Transform
const Duplex = require('stream').Duplex
const Writable = require('stream').Writable
const Readable = require('stream').Readable

const chalk = require('chalk')
const robot = require('robotjs')

const piano = require('./piano')
const instruments = require('./instruments')

let streams = []

const track = (stream) => {
    streams.push(stream)
    return stream
}

exports.unpipeAll = () => {
    streams.forEach(s => s.unpipe())
}

const objectify = chunk => {
    if (typeof chunk !== 'string') return chunk

    return {
        input: chunk
    }
}

// source
exports.from = (...args) => {
    const input = args.reduce((memo, cur) => {
        return memo.concat(cur)
    }, [])
    return track(
        new Readable({
            objectMode: true,
            highWaterMark: input.length,
            read() {
                const nextNote = input.shift()
                setTimeout(() => {
                    input.push(nextNote)
                    this.push(nextNote)
                }, 10) // prevent unstoppable runs
            }
        })
    )
}

// write notes to REPL
exports.toRepl = () => {
    return track(
        new Duplex({
            objectMode: true, // drops hwm to 16
            highWaterMark: 8, // or 16 will be hit
            read() {},
            write(chunk, encoding, callback) {
                const note = chunk.toString().replace(/^(.)\#/,'$1s')
                // use typeString over stdout as the latter won't allow the user
                // to delete as though they entered the text themselves
                robot.typeString(`${note}, `)

                callback(null, chunk)
                this.push(chunk)
            }
        })
    )
}

exports.toLogger = () => {
    return track(
        new Duplex({
            objectMode: true, // drops hwm to 16
            highWaterMark: 8, // or 16 will be hit
            read() {},
            write(chunk, encoding, callback) {
                chunk = objectify(chunk)
                console.log(chalk.gray(chunk.played || chunk.input))
                callback(null, chunk)
                this.push(chunk)
            }
        })
    )
}

// write notes to audio channel
exports.toAudio = () => {
    return track(
        new Duplex({
            objectMode: true, // drops hwm to 16
            highWaterMark: 8, // or 16 will be hit
            read() {},
            write(chunk, encoding, callback) {
                chunk = objectify(chunk)

                let response
                try {
                    response = instruments.play(chunk.input, chunk.instrument)
                    chunk.played = response
                } catch (e) {
                    return callback(new Error(`Cannot parse note "${chunk.input}"`))
                }
                callback(null, chunk)
                this.push(chunk)
            }
        })
    )
}

// write notes to draw piano
exports.toPiano = () => {
    return track(
        new Duplex({
            objectMode: true, // drops hwm to 16
            highWaterMark: 8, // or 16 will be hit
            read() {},
            write(chunk, encoding, callback) {
                chunk = objectify(chunk)

                const drawnPiano = piano.draw(chunk.input)

                const push = this.push.bind(this)

                // only allow reads once the piano is drawn
                drawnPiano.pipe(new Writable({
                    write() {
                        callback(null, chunk)
                        push(chunk)
                    }
                }))
            }
        })
    )
}

exports.on = instrument => {
    return track(
        new Transform({
            objectMode: true,
            highWaterMark: 8,
            transform(chunk, encoding, callback) {
                chunk = objectify(chunk)
                chunk.instrument = instruments.findByName(instrument)
                callback(null, chunk)
            }
        })
    )
}

// stream factory that emits chunks over a given interval series (cycling through)
exports.delay = (...args) => {
    let started
    const intervals = args.reduce((memo, cur) => {
        return memo.concat(cur)
    }, [])
    return track(
        new Transform({
            objectMode: 1,
            highWaterMark: 1, // prevent build up of notes until read
            transform(chunk, encoding, callback) {
                if (!started) {
                    started = true
                    callback(null, chunk)
                } else {
                    const lastInterval = intervals.shift()
                    setTimeout(() => {
                        callback(null, chunk)
                    }, lastInterval)
                    intervals.push(lastInterval)
                }
            }
        })
    )
}