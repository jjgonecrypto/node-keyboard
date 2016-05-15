'use strict';

const fs = require('fs')
const path = require('path')
const player = require('play-sound')()

const pathToSoundfonts = path.join(__dirname, '..', 'midi-js-soundfonts', 'FluidR3_GM')

module.exports = {
    collection() {
        const items = fs.readdirSync(pathToSoundfonts)
        const dirs = items.filter(i => fs.lstatSync(path.join(pathToSoundfonts, i)).isDirectory());
        return dirs.map(dir => dir.slice(0, -4));
    },

    get(instrumentName) {
        return {
            play(note = '') {
                const pathToAudio = path.join(pathToSoundfonts, `${instrumentName}-mp3`, `${note.toUpperCase()}.mp3`);

                if (!fs.existsSync(pathToAudio)) {
                    return console.error(`cannot play "${note}"`)
                }

                player.play(pathToAudio, function(err){
                    if (err) console.error(err)
                })
            }
        }
    }
}
