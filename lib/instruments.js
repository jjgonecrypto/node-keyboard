'use strict';

const fs = require('fs')
const path = require('path')
const teoria = require('teoria')
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

                function pathToAudio(n) {
                    return path.join(pathToSoundfonts, `${instrumentName}-mp3`, `${n.toUpperCase()}.mp3`)
                }

                let possibleNotes = [note];

                try {
                    possibleNotes = possibleNotes
                        .concat(teoria.note(note).toString())
                        .concat(teoria.note(note).enharmonics(true).map(n => n.toString()))
                } catch (e) {}

                const noteThatExists = possibleNotes.map(n => pathToAudio(n)).find(p => fs.existsSync(p))

                if (!noteThatExists) {
                     return console.error(`cannot play "${note}"`)
                }

                player.play(noteThatExists, function(err){
                    if (err) console.error(err)
                })
            }
        }
    }
}
