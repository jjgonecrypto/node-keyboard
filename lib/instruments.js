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

    get(defaultInstrument) {
        return {
            play(note, instrument) {
                note = note || ''

                instrument = instrument || defaultInstrument

                function pathToAudio(note) {
                    return path.join(pathToSoundfonts, `${instrument}-mp3`, `${note.toString().toUpperCase()}.mp3`)
                }

                let possibleNotes = [];

                try {
                    possibleNotes = possibleNotes
                        .concat(teoria.note(note))
                        .concat(teoria.note(note).enharmonics(true))
                } catch (e) {}

                const noteThatExists = possibleNotes
                    .map(n => { return { note: n, path: pathToAudio(n) } })
                    .find(n => fs.existsSync(n.path))

                if (!noteThatExists) {
                    throw `cannot play "${note}"`
                }

                player.play(noteThatExists.path, function(err){
                    if (err) throw err
                })

                return `${instrument}: ${noteThatExists.note.fq() < 130 ? '𝄢' : '𝄞'} ♩ ${teoria.note(note).toString()}`
            }
        }
    }
}
