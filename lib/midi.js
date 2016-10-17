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

    // transform midi to understandable notes
    const midiIn = new Transform({
        transform(chunk, encoding, callback) {
            // for info on data response, use http://www.music-software-development.com/midi-tutorial.html

            // status: NOTE ON 144, NOTE OFF 128, MODULATION 160
            // pitch: from 0 - 127 (but 8va piano is 21-109 A0-C#8)
            // velocity: from 1 - 127 (0 is silent, occurs with NOTE OFF)
            const [ status, pitch /*, velocity */ ] = chunk.toJSON().data

            let note

            try {
                note = status === 144 ? teoria.note.fromMIDI(pitch).toString() : undefined
            } catch (e) { /* Cannot parse so ignore */ }

            callback(null, note)
        }
    })

    midi.createReadStream(input).pipe(midiIn)
    return midiIn
}
