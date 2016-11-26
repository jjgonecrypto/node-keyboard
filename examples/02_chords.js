const { chord, play, piano } = require('../lib/mappers')

const playEvery = ms => {
    return (note,i) => setTimeout(() => [note].map(play).forEach(piano), i*ms)
}

module.exports = {
    // Arpeggio a chord
    // example_02_chords.arpeggio({ chordName: 'c9' })
    arpeggio({ chordName, ms = 250 }) {
        const notesInChord = chord(chordName)
        if (!notesInChord.length) return
        const octaveUp = notesInChord[0].replace(/[0-9]/, i => Number(i)+1)
        const notes = notesInChord.concat(octaveUp, notesInChord.slice().reverse())
        notes.forEach(playEvery(ms))
    },
}
