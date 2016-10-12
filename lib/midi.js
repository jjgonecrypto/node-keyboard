'use strict'

const Writable = require('stream').Writable
const midi = require('midi')

module.exports = replServer => {

    // create a readable stream
    const input = new midi.input()

    try {
        input.openPort(0)
    } catch (e) {
        // No MIDI support
        return
    }

    const playStream = new Writable({
        objectMode: true,
        write: (chunk, enc, next) => {

            // for info on data response, use http://www.music-software-development.com/midi-tutorial.html

            // status: NOTE ON 144, NOTE OFF 128, MODULATION 160
            // pitch: from 0 - 127 (but 8va piano is 21-109 A0-C#8)
            // velocity: from 1 - 127 (0 is silent, occurs with NOTE OFF)
            const [ status, pitch /*, velocity */ ] = chunk.toJSON().data

            if (status === 144) replServer.context.play(pitch)

            next()
        }
    })

    replServer.on('exit', input.closePort.bind(input))

    midi.createReadStream(input).pipe(playStream)
}
