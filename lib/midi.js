'use strict'

const Readable = require('stream').Readable

const chalk = require('chalk')
const teoria = require('teoria')
const midi = require('midi')
const objectify = require('./objectify')

module.exports = replServer => {

    // create a readable stream
    const input = new midi.input()

    try {
        input.openPort(0)
        replServer.on('exit', input.closePort.bind(input))
    } catch (e) {
        // No MIDI device detected
        input.openVirtualPort('test') // fake port to prevent cleanup below from dying
        input.closePort()
        console.log(chalk.red('MIDI not detected. Disabling support.'))
        return
    }

    // track notes to allow us to kill the player when note off received
    let noteTracker = {}

     // transform midi to understandable notes
    const midiIn = new Readable({
        objectMode: true,
        read() {}
    })

    input.on('message', (deltaTime, message) => {
        // for info on data response, use http://www.music-software-development.com/midi-tutorial.html

        // status: NOTE ON 144, NOTE OFF 128, MODULATION 160, SUSTAIN PEDAL 176
        // pitch: from 0 - 127 (but 8va piano is 21-109 A0-C#8)
        // velocity: from 1 - 127 (0 is silent, occurs with NOTE OFF)
        const [ status, pitch , velocity ] = new Buffer(message)

        try {
            const input = status === 144 ? teoria.note.fromMIDI(pitch).toString() : undefined
            if (status === 128 && noteTracker[pitch] && noteTracker[pitch].kill) {
                const kill = noteTracker[pitch].kill
                delete noteTracker[pitch]
                setTimeout(kill, 250)
            }

            if (input) {
                noteTracker[pitch] = Object.assign({ volume: velocity / 127 }, objectify(input))
                midiIn.push(noteTracker[pitch])
            }
        } catch (err) { return midiIn.emit('error', err) }
    })

    return midiIn
}
