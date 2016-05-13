'use strict';

const fs = require('fs')
const path = require('path')

const pathToSoundfonts = path.join(__dirname, '..', 'midi-js-soundfonts', 'FluidR3_GM')

const instrumentData = {};

function getNoteForInstrument(instrumentName, note, callback) {

    instrumentData[instrumentName] = instrumentData[instrumentName] || {}
    const thisInstrumentData = instrumentData[instrumentName]

    if (note in thisInstrumentData) {
        process.nextTick(callback, null, thisInstrumentData[note])
    } else {
        const pathToAudio = path.join(pathToSoundfonts, `${instrumentName}-mp3`, `${note}.mp3`);
        console.log('opening ', pathToAudio);
        fs.readFile(pathToAudio, (err, buffer) => {
            thisInstrumentData[note] = buffer
            callback(err, buffer)
        });
    }
}

module.exports = {
    ls() {
        fs.readdir(pathToSoundfonts, (err, items) => {
            const dirs = items.filter(i => fs.lstatSync(path.join(pathToSoundfonts, i)).isDirectory());
            console.log(dirs.map(d => d.replace(/-mp3$/, '')));
        });
    },

    get(context, instrumentName) {

        return {
            play(note) {
                getNoteForInstrument(instrumentName, note.toUpperCase(), (err, buffer) => {
                    if (err) {
                        return console.error(err)
                    }

                    context.decodeAudioData(buffer, function(audioBuffer) {
                        var bufferNode = context.createBufferSource()
                        var gain = 2

                        var vca = context.createGain()
                        vca.gain.value = gain
                        bufferNode.connect(vca)
                        vca.connect(context.destination)

                        // bufferNode.connect(context.destination)
                        bufferNode.buffer = audioBuffer
                        // bufferNode.loop = true
                        bufferNode.start(context.currentTime)
                    }, e => { console.error('Error with decoding audio data' + e.err) })
                })
            }
        }


    }
}
