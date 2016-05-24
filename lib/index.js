'use strict'

const repl = require('repl')
const chalk = require('chalk')

const instruments = require('./instruments')

const allInstruments = instruments.collection()

let currentInstrument = 'acoustic_grand_piano'

let COLORS = ['green', 'yellow', 'blue', 'magenta', 'cyan']

let lastColor

function getPrompt() {
    let randomIndex = Math.floor(Math.random() * COLORS.length)
    if (COLORS[randomIndex] === lastColor) randomIndex = randomIndex + 1 % COLORS.length
    lastColor = COLORS[randomIndex]
    return chalk[lastColor](`${currentInstrument}`) + chalk.gray('>')
}

function showHeading(title, fnc) {
    let spacer = ''
    for (let i = 0; i < title.length; i++) {spacer += '-'}
    [spacer, title, spacer].forEach(s => console.log(chalk.gray(s.replace(new RegExp(fnc), chalk.green(fnc)))))
}

function showCommand(title, line) {
    console.log(chalk.gray(title))
    console.log(chalk.gray('>') + line)
}

function showInstructions() {
    process.stdout.write('\x1B[2J')

    showHeading('Welcome. To hear music, use the play function as in:', 'play')

    showCommand('C Major', '[\'c2\', \'e7\', \'g5\', \'e4\'].forEach(play)')
    showCommand('E7', '[\'e\', \'g#\', \'b\', \'d\'].forEach(play)')
    showCommand('cm triad', '[\'c\', \'eb\', \'g\', \'eb\', \'c\'].forEach((note, i) => setTimeout(() => play(note), i * 500))')

    showHeading('To switch instrument, map with using function as in', 'using')

    showCommand('f dim 7', '[\'f#1\', \'a4\', \'c\', \'eb2\', \'f#5\'].map(using(\'trumpet\')).forEach(play)')
    showCommand('or get creative', '[\'f#\', \'c#\'].map(using(\'bass\')).concat([\'a\', \'f#5\'].map(using(\'guitar\'))).forEach(play)')

    showHeading('To see other instruments, type ".all"', '.all')
    showHeading('To change default instrument, type ".use [instrument]", where [instrument] is a part of any instrument name', '.use')
}

showInstructions()

let replServer = repl.start({ prompt: getPrompt(), ignoreUndefined: true })

replServer.defineCommand('all', {
    help: 'node-keyboard: See all instruments',
    action: function() {
        console.log(allInstruments.join('\n'))
        this.displayPrompt()
    }
})

function findInstrumentByName(name) {
    return allInstruments.find(i => new RegExp(name, 'i').test(i))
}

replServer.defineCommand('use', {
    help: 'node-keyboard: Change instrument',
    action: function(newInstrument) {
        currentInstrument = findInstrumentByName(newInstrument) || currentInstrument
        replServer.setPrompt(getPrompt())
        this.displayPrompt()
    }
})

replServer.defineCommand('keyboard', {
    help: 'node-keyboard: See keyboard commands',
    action: function() {
        showInstructions()
        this.displayPrompt()
    }
})

replServer.context.using = function(instrument) {
    return note => {
        return {
            instrument: findInstrumentByName(instrument) || currentInstrument,
            note
        }
    }
}.bind(replServer)

replServer.context.play = function(input) {
    let response

    try {
        if (typeof input === 'object') {
            response = instruments.get(currentInstrument).play(input.note, input.instrument)
        } else {
            response = instruments.get(currentInstrument).play(input)
        }
        console.log(chalk.gray(response))
    } catch (err) {
        console.error(chalk.red(err))
    }
}.bind(replServer)
