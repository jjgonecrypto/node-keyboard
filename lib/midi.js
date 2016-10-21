'use strict'

const Transform = require('stream').Transform

const chalk = require('chalk')
const teoria = require('teoria')
const midi = require('midi')

module.exports = replServer => {

    // create a readable stream
    const input = new midi.input()

    try {
        input.openPort(0)
        replServer.on('exit', input.closePort.bind(input))
    } catch (e) {
        // No MIDI support
        console.log(chalk.red('MIDI not detected. Disabling support.'))
        return
    }

    // track notes to allow us to kill the player when note off received
    let noteTracker = {}

    // transform midi to understandable notes
    const midiIn = new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            // for info on data response, use http://www.music-software-development.com/midi-tutorial.html

            // status: NOTE ON 144, NOTE OFF 128, MODULATION 160, SUSTAIN PEDAL 176
            // pitch: from 0 - 127 (but 8va piano is 21-109 A0-C#8)
            // velocity: from 1 - 127 (0 is silent, occurs with NOTE OFF)
            const [ status, pitch , velocity ] = chunk.toJSON().data

            try {
                const input = status === 144 ? teoria.note.fromMIDI(pitch).toString() : undefined
                if (status === 128 && noteTracker[pitch] && noteTracker[pitch].player) {
                    const player = noteTracker[pitch].player
                    delete noteTracker[pitch]
                    setTimeout(() => player.kill(), 250)
                }

                if (input) {
                    noteTracker[pitch] = { input, volume: velocity / 127 }
                    return callback(null, noteTracker[pitch])
                }
            } catch (e) { /* Cannot parse so ignore */ console.error(e)}

            callback(null)
        }
    })

    midi.createReadStream(input).pipe(midiIn)
    return midiIn
}
