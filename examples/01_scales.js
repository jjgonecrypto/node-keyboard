const { scale, play, piano, sequence } = require('../lib/mappers')

const playEvery = ms => {
    return (note,i) => setTimeout(() => [note].map(play).forEach(piano), i*ms)
}

module.exports = {
    chromatic({ key = 'a', ms = 200 } = {}) {
        const baseScale = scale(key, 'chromatic')
        if (!baseScale.length) return
        const notes = [].concat(baseScale, `${key}4`, baseScale.slice().reverse())
        notes.forEach(playEvery(ms))
    },

    // play a mode. E.g. C Aeolin is mode({ key: c, mode: 6 })
    mode({ key = 'c', number = 1, ms = 250 } = {}) {
        let progression = [2, 2, 1, 2, 2, 2, 1]
        const notes = sequence(key, progression.slice(number - 1).concat(progression.slice(0, number - 1)))
        notes.forEach(playEvery(ms))
    }

}
