'use strict'

const fs = require('fs')
const path = require('path')
const teoria = require('teoria')
const player = require('play-sound')()

const pathToSoundfonts = path.join(__dirname, '..', 'midi-js-soundfonts', 'FluidR3_GM')

module.exports = {
    get all() {
        delete this.all
        const items = fs.readdirSync(pathToSoundfonts)
        const dirs = items.filter(i => fs.lstatSync(path.join(pathToSoundfonts, i)).isDirectory())
        return this.all = dirs.map(dir => dir.slice(0, -4))
    },

    play(chunk) {
        const { input, instrument = 'acoustic_grand_piano' } = chunk

        function pathToAudio(note) {
            return path.join(pathToSoundfonts, `${instrument}-mp3`, `${note.toString().toUpperCase()}.mp3`)
        }

        let possibleNotes = []

        const noteObj = typeof input === 'number' ? teoria.note.fromMIDI(input) : teoria.note(input)

        // deal with possiblity that teoria cannot parse some note and will throw
        try {
            possibleNotes = possibleNotes
                .concat(noteObj)
                .concat(noteObj.enharmonics(true))
        } catch (e) {}

        const noteThatExists = possibleNotes
            .map(n => { return { note: n, path: pathToAudio(n) } })
            .find(n => fs.existsSync(n.path))

        if (!noteThatExists) {
            throw new Error(`Cannot play "${input}"`)
        }

        const opts = chunk.volume ? { afplay: ['-v', chunk.volume * 3] } : {}
        chunk.player = player.play(noteThatExists.path, opts, err => {
            if (err && !err.killed) throw err
        })

        chunk.played = `${instrument}: ${noteThatExists.note.fq() < 130 ? '𝄢' : '𝄞'} ♩ ${noteObj.toString()}`

        return chunk
    },

    findByName(instrument) {
        return this.all.find(i => new RegExp(instrument, 'i').test(i))
    }
}
