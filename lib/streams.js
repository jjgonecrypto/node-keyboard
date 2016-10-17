'use strict'

const Transform = require('stream').Transform
const Writable = require('stream').Writable
const Readable = require('stream').Readable

const robot = require('robotjs')
const piano = require('./piano')
const { play } = require('./functions')

exports.toRepl = () => new Transform({
    transform(chunk, encoding, callback) {
        const note = chunk.toString().replace(/^(.)\#/,'$1s')
        robot.typeString(`${note}, `)

        callback(null, chunk)
    }
})

// write notes to audio channel
exports.toAudio = () => new Transform({
    transform(chunk, encoding, callback) {
        play(chunk.toString())

        callback(null, chunk)
    }
})

// write notes to draw piano
exports.toPiano = () => new Transform({
    transform(chunk, encoding, callback) {
        const drawnPiano = piano.draw(chunk.toString())

        // only allow reads once the piano is drawn
        drawnPiano.pipe(new Writable({
            write() {
                callback(null, chunk)
            }
        }))
    }
})

// stream factory that emits chunks over a given interval series (cycling through)
exports.withDelay = intervals => {
    intervals = [].concat(intervals) // clone
    return new Transform({
        transform(chunk, encoding, callback) {
            const lastInterval = intervals.shift()
            setTimeout(() => {
                callback(null, chunk)
            }, lastInterval)
            intervals.push(lastInterval)
        }
    })
}

exports.fromArray = (...args) => {
    const input = args.reduce((memo, cur) => {
        return memo.concat(cur)
    }, [])
    return new Readable({
        objectMode: true,
        read() {
            input.forEach(a => this.push(a))
            this.push(null)
        }
    })
}
