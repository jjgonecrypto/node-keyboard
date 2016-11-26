const { play, instrument, log } = require('../lib/mappers')

const playEvery = ms => {
    return (notes,i) => setTimeout(() => [].concat(notes).map(play).forEach(log), i*ms)
}

module.exports = {
    // play notes on a random instrument
    // example_04_instruments.random({ notes: [c, e, g] })
    random({ notes = [], ms = 250 } = { }) {
        notes.map(instrument()).forEach(playEvery(ms))
    }
}
