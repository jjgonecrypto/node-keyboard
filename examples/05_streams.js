const streams = require('../lib/streams')

const { from, on, delay } = streams

const midi = require('../lib/midi')

module.exports = () => {

    // banjo loop
    from('c','e','g').pipe(delay(400)).pipe(on('banjo')).pipe(streams.toAudio)

    const midiIn = midi()
    // delay midiIn notes by 400ms
    if (midiIn) midiIn.pipe(delay(400)).pipe(streams.toAudio).pipe(streams.toPiano)
}

// Hit CTRL+C to kill
