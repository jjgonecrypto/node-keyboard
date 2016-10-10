'use strict'

const chalk = require('chalk')

function showHeading(title, regExp) {
    console.log('\n' + chalk.gray(title.replace(regExp, m => chalk.green(m))))
}

function showCommand(title, line) {
    console.log(chalk.gray('>') + line + chalk.gray(` // ${title}`))
}

exports.show = () => {
    process.stdout.write('\x1B[2J')

    showHeading('Welcome. To hear music, use the play function as in:', /play/)
    showCommand('C Major', '[\'c2\', \'e7\', \'g5\', \'e4\'].forEach(play)')

    showHeading('Use chord to explode a chord into an array of notes as in:', /chord/)
    showCommand('faug7', 'chord(\'faug7\').forEach(play)')

    showHeading('Delay each successive note by the given interval by mapping with every:', /every/)
    showCommand('F# triad', '[\'f#3\', \'a#4\', \'c#5\', \'f#6\'].map(every(500)).forEach(play)')
    showCommand('cm triad', '[\'c\', \'eb\', \'g\', \'eb\', \'c\'].map(every(250)).forEach(play)')

    showHeading('Use scale to project a scale into an array of notes as in:', /scale/)
    showCommand('c5 harmonic minor', 'scale(\'c5\', \'harmonicminor\').map(every(400)).forEach(play)')

    showHeading('To see supported scales type ".scales"', /\.scales/)

    showHeading('To switch instrument, map with using function as in:', /using/)
    showCommand('f dim 7', '[\'f#1\', \'a4\', \'c\', \'eb2\', \'f#5\'].map(using(\'trumpet\')).forEach(play)')

    showHeading('To see other instruments, type ".all"', /\.all/)
    showHeading('To change default instrument, type ".use [instrument]", where [instrument] is a part of any instrument name', /\.use/)
}
