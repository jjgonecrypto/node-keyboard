'use strict'

const Transform = require('stream').Transform
const Duplex = require('stream').Duplex
const Writable = require('stream').Writable
const Readable = require('stream').Readable

const chalk = require('chalk')
const robot = require('robotjs')
const piano = require('./piano')
const objectify = require('./objectify')
const mappers = require('./mappers')
const instruments = require('./instruments')

let streams = []

const track = (stream) => {
    // when this stream is piped into
    stream.on('pipe', src => {
        // from a Transform
        if (src instanceof Transform || src instanceof Readable) {
            // then track it to unpipe it with others
            streams.push(src)
        }
    })

    streams.push(stream)
    return stream
}

exports.unpipeAll = () => {
    streams.forEach(s => s.unpipe())
    streams = []
}

// source
exports.from = (...args) => {
    const input = args.reduce((memo, cur) => {
        return memo.concat(cur)
    }, [])
    return new Readable({
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
}

// write notes to REPL
exports.toRepl = () => {
    return track(
        new Duplex({
            objectMode: true, // drops hwm to 16
            highWaterMark: 8, // or 16 will be hit
            read() {},
            write(chunk, encoding, callback) {
                chunk = objectify(chunk)

                const note = chunk.input.replace(/^(.)\#/,'$1s')
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
                try {
                    chunk = mappers.play(chunk)
                } catch (e) {
                    return callback(e)
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

// instrument transform - play notes through this instrument
exports.on = instrument => {
    instrument = instrument || instruments.random
    return new Transform({
        objectMode: true,
        highWaterMark: 1,
        transform(chunk, encoding, callback) {
            chunk = mappers.instrument(chunk, instrument)
            callback(null, chunk)
        }
    })
}

// stream factory that emits chunks over a given interval series (cycling through)
exports.delay = (...args) => {
    let started
    const intervals = args.reduce((memo, cur) => {
        return memo.concat(cur)
    }, [])
    return new Transform({
        objectMode: true,
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
}
