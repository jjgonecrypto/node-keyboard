'use strict'

const chalk = require('chalk')

function showHeading(title, regExp) {
    console.log('\n' + chalk.gray(title.replace(regExp, m => chalk.green(m))))
}

function showCommand({ input, comment}) {
    console.log(`${input}${comment ? chalk.gray(` // ${comment}`) : ''}`)
}

exports.show = () => {
    process.stdout.write('\x1B[2J')

    // Streaming
    showHeading('At any time, CANCEL any open streams with CTRL+C (SIGINT)', /CTRL\+C/)

    showHeading('Two input streams are supported. midiIn for MIDI support and from for array support', /(midiIn|from)/g)

    showHeading('Welcome. To hear music, pipe into the toAudio stream as in', /toAudio/)
    showCommand({ comment: 'C Major', input: 'from(c2, e7, g5, e4).pipe(toAudio)' })

    showHeading('Pipe toPiano to see the piano output:', /toPiano/)
    showCommand({ comment: 'f dim 7', input: 'from(a, c, e).pipe(toPiano).pipe(toAudio)' })

    showHeading('Pipe toLogger to see the note:', /toLogger/)
    showCommand({ comment: 'f dim 7', input: 'from(a, c, e).pipe(toPiano).pipe(toLogger).pipe(toAudio)' })

    showHeading('Pipe toRepl to output the note:', /toLogger/)
    showCommand({ comment: '', input: 'midiIn.pipe(toRepl)' })

    showHeading('Delay each successive note by the given interval by piping through delay:', /delay/)
    showCommand({ comment: 'F# triad', input: 'from(fs3, as4, cs5, fs6).pipe(delay(500)).pipe(toAudio)' })

    showHeading('To switch instrument, pipe through the on stream:', /on/)
    showCommand({ comment: 'f dim 7', input: 'from(fs1, a4, c, ds2, fs5).pipe(on(\'trumpet\')).pipe(toAudio)' })

    // Other
    showHeading('Non-streaming support:')

    showHeading('To listen without streams, use play as a side effect:', /play/)
    showCommand({ comment: 'C Major', input: '[c,e,g].forEach(play)' })

    showHeading('To change instrument, use the instrument functor:', /instrument/)
    showCommand({ comment: 'C Major', input: '[c,e,g].map(instrument(\'guitar\')).forEach(play)' })

    showHeading('To see all instruments, type "instruments"', /\.all/)

    showHeading('Use chord to project a chord into an array of notes as in:', /chord/)
    showCommand({ comment: 'faug7', input: 'chord(\'faug7\').forEach(play)' })

    showHeading('Use scale to project a scale into an array of notes as in:', /scale/)
    showCommand({ comment: 'c5 harmonic minor', input: 'scale(c5, \'harmonicminor\')' })

    showHeading('To see supported scales type "scales"', /scales/)

    showHeading('Use interval to project a note into an array of notes as in:', /interval/)
    showCommand({ comment: 'C9', input: '[c,e,g].map(interval(\'P1\',\'P5\')).reduce((acc, cur) => acc.concat(cur), [])' })

}
