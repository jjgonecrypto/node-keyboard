'use strict'

const Transform = require('stream').Transform
const Duplex = require('stream').Duplex
const Writable = require('stream').Writable
const Readable = require('stream').Readable

const robot = require('robotjs')
const piano = require('./piano')
const { play } = require('./functions')

let streams = []

const track = (stream) => {
    streams.push(stream)
    return stream
}

exports.unpipeAll = () => {
    streams.filter(s => typeof s.unpipe === 'function').forEach(s => s.unpipe())
}

exports.toRepl = () => {
    return track(
        new Duplex({
            objectMode: true, // drops hwm to 16
            highWaterMark: 8, // or 16 will be hit
            read() {},
            write(chunk, encoding, callback) {
                const note = chunk.toString().replace(/^(.)\#/,'$1s')
                robot.typeString(`${note}, `)

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
                play(chunk.toString())
                setTimeout(() => {
                    callback(null, chunk)
                    this.push(chunk)
                }, 10) // prevent unstoppable runs
            }
        })
    )
}

// write notes to draw piano
exports.toPiano = () => {
    return track(
        new Transform({
            objectMode: true, // drops hwm to 16
            highWaterMark: 8, // or 16 will be hit
            read() {},
            write(chunk, encoding, callback) {
                const drawnPiano = piano.draw(chunk.toString())

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

// stream factory that emits chunks over a given interval series (cycling through)
exports.withDelay = (...args) => {
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
                this.push(nextNote)
                input.push(nextNote)
            }
        })
    )
}
