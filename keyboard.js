'use strict'

const repl = require('repl')
const chalk = require('chalk')

const instruments = require('./lib/instruments')

const allInstruments = instruments.collection()

let currentInstrument = 'acoustic_grand_piano'

let COLORS = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray']

let lastColor

function getPrompt() {
    let randomIndex = Math.floor(Math.random() * COLORS.length)
    if (COLORS[randomIndex] === lastColor) randomIndex = randomIndex + 1 % COLORS.length
    lastColor = COLORS[randomIndex]
    return chalk[lastColor](`${currentInstrument}`) + chalk.gray('>')
}

function showInstructions() {
    process.stdout.write('\x1B[2J')

    console.log('---------------------------------------------------------------')
    console.log('Welcome. To play music, use the play() function as in:')
    console.log('---------------------------------------------------------------')

    console.log('C Major')
    console.log('>[\'c2\', \'e7\', \'g5\', \'e4\'].forEach(play)')
    console.log()
    console.log('E7')
    console.log('>[\'e\', \'g#\', \'b\', \'d\'].forEach(play)')
    console.log()
    console.log('C minor triad')
    console.log('>[\'c\', \'eb\', \'g\', \'eb\', \'c\'].forEach((note, i) => setTimeout(() => play(note), i * 500))')
    console.log('---------------------------------------------------------------')
    console.log('To see other instruments, type ".all"')
    console.log('---------------------------------------------------------------------------------------------------')
    console.log('To change instrument, type ".use [instrument]", where [instrument] is a part of any instrument name')
    console.log('---------------------------------------------------------------------------------------------------')
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

replServer.defineCommand('use', {
    help: 'node-keyboard: Change instrument',
    action: function(newInstrument) {
        currentInstrument = allInstruments.find(i => new RegExp(newInstrument, 'i').test(i)) || currentInstrument
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

replServer.context.play = function(note) {
    instruments.get(currentInstrument).play(note)
    this.displayPrompt()
}.bind(replServer)
