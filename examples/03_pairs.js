const { play, piano, interval } = require('../lib/mappers')

const playEvery = ms => {
    return (notes,i) => setTimeout(() => [].concat(notes).map(play).forEach(piano), i*ms)
}

module.exports = {
    // Play thirds over some notes, eg.
    // example_03_pairs.thirds({ notes: [c, e, g] })
    thirds({ notes = [], ms = 250 } = {}) {
        notes.map(interval('P1','m3')).forEach(playEvery(ms))
    },

    // Play fifths over some notes
    // example_03_pairs.fifths({ notes: [c1, c2, c3, c4], ms: 500 })
    fifths({ notes = [], ms = 250 } = {}) {
        notes.map(interval('P1','P5')).forEach(playEvery(ms))
    }
}
