'use strict'

const fs = require('fs')
const path = require('path')
const teoria = require('teoria')
const player = require('play-sound')()

const pathToSoundfonts = path.join(__dirname, '..', 'midi-js-soundfonts', 'FluidR3_GM')

module.exports = {
    collection() {
        const items = fs.readdirSync(pathToSoundfonts)
        const dirs = items.filter(i => fs.lstatSync(path.join(pathToSoundfonts, i)).isDirectory())
        return dirs.map(dir => dir.slice(0, -4))
    },

    get(defaultInstrument) {
        return {
            play(note = '', instrument) {
                instrument = instrument || defaultInstrument

                function pathToAudio(note) {
                    return path.join(pathToSoundfonts, `${instrument}-mp3`, `${note.toString().toUpperCase()}.mp3`)
                }

                let possibleNotes = []

                const noteObj = typeof note === 'number' ? teoria.note.fromMIDI(note) : teoria.note(note)

                // deal with possiblity that teoria cannot parse note and will throw
                try {
                    possibleNotes = possibleNotes
                        .concat(noteObj)
                        .concat(noteObj.enharmonics(true))
                } catch (e) {}

                const noteThatExists = possibleNotes
                    .map(n => { return { note: n, path: pathToAudio(n) } })
                    .find(n => fs.existsSync(n.path))

                if (!noteThatExists) {
                    throw `cannot play "${note}"`
                }

                player.play(noteThatExists.path, { timeout: 750 }, err => {
                    if (err) throw err
                })

                return `${instrument}: ${noteThatExists.note.fq() < 130 ? '𝄢' : '𝄞'} ♩ ${noteObj.toString()}`
            }
        }
    },

    findByName(instrument) {
        return this.collection().find(i => new RegExp(instrument, 'i').test(i))
    }
}
