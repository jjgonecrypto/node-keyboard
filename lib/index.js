'use strict'

const repl = require('repl')
const chalk = require('chalk')
const teoria = require('teoria')

const instruments = require('./instruments')
const functions = require('./functions')

const COLORS = ['green', 'yellow', 'blue', 'magenta', 'cyan']

function showHeading(title, regExp) {
    console.log('\n' + chalk.gray(title.replace(regExp, m => chalk.green(m))))
}

function showCommand(title, line) {
    console.log('\t' + chalk.gray(title) + chalk.gray('>') + line)
}

function showInstructions() {
    process.stdout.write('\x1B[2J')

    showHeading('Welcome. To hear music, use the play function as in:', /play/)
    showCommand('C Major', '[\'c2\', \'e7\', \'g5\', \'e4\'].forEach(play)')
    showCommand('cm triad', '[\'c\', \'eb\', \'g\', \'eb\', \'c\'].forEach((note, i) => setTimeout(() => play(note), i * 500))')

    showHeading('Use chord to explode a chord into an array of notes as in:', /chord/)
    showCommand('faug7', 'chord(\'faug7\').forEach(play)')

    showHeading('Use scale to project a scale into an array of notes as in:', /scale/)
    showCommand('c5 harmonic minor', 'scale(\'c5\', \'harmonicminor\').forEach((n,i) => setTimeout(() => play(n), 250*i))')

    showHeading('To see supported scales type ".scales"', /\.scales/)

    showHeading('To switch instrument, map with using function as in:', /using/)
    showCommand('f dim 7', '[\'f#1\', \'a4\', \'c\', \'eb2\', \'f#5\'].map(using(\'trumpet\')).forEach(play)')


    showHeading('To see other instruments, type ".all"', /\.all/)
    showHeading('To change default instrument, type ".use [instrument]", where [instrument] is a part of any instrument name', /\.use/)
}

showInstructions()

let lastColor

function getPrompt(instrument) {
    let randomIndex = Math.floor(Math.random() * COLORS.length)
    if (COLORS[randomIndex] === lastColor) randomIndex = randomIndex + 1 % COLORS.length
    lastColor = COLORS[randomIndex]
    return chalk[lastColor](instrument) + chalk.gray('>')
}

const startingInstrument = 'acoustic_grand_piano'

const replServer = repl.start({ prompt: getPrompt(startingInstrument), ignoreUndefined: true })

replServer.context.currentInstrument = startingInstrument

replServer.defineCommand('all', {
    help: 'node-keyboard: See all instruments',
    action: function() {
        console.log(instruments.collection().join('\n'))
        this.displayPrompt()
    }
})

replServer.defineCommand('use', {
    help: 'node-keyboard: Change instrument',
    action: function(newInstrument) {
        this.context.currentInstrument = instruments.findByName(newInstrument) || this.context.currentInstrument
        replServer.setPrompt(getPrompt(this.context.currentInstrument))
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

replServer.defineCommand('scales', {
    help: 'node-keyboard: See supported scales',
    action: function() {
        teoria.Scale.KNOWN_SCALES.forEach(s => console.log(s))
        this.displayPrompt()
    }
})

Object.keys(functions).forEach(fncName => replServer.context[fncName] = functions[fncName].bind(replServer.context))
