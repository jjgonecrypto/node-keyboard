'use strict'

const Writable = require('stream').Writable
const midi = require('midi')

module.exports = replServer => {

    // create a readable stream
    const input = new midi.input()
    input.openPort(0)

    const playStream = new Writable({
        objectMode: true,
        write: (chunk, enc, next) => {
            const data = chunk.toJSON().data

            // for info on data response, use http://www.music-software-development.com/midi-tutorial.html

            // NOTE ON 144, NOTE OFF 128, MODULATION 160
            const status = data[0]

            // from 0 - 127 (but 8va piano is 21-109 A0-C#8)
            const pitch = data[1]

            // from 1 - 127 (0 is silent, occurs with NOTE OFF)
            // const velocity = data[2]

            if (status === 144) replServer.context.play(pitch)

            next()
        }
    })

    replServer.on('exit', input.closePort.bind(input))

    midi.createReadStream(input).pipe(playStream)
}
