'use strict'

const repl = require('repl')
const chalk = require('chalk')
const teoria = require('teoria')
const fs = require('fs')
const path = require('path')

const instruments = require('./instruments')
const functions = require('./functions')
const midi = require('./midi')
const piano = require('./piano')
const colors = require('./colors')
const instructions = require('./instructions')
const evaluator = require('./evaluator')

function getPrompt(instrument) {
    lastColor = colors.getRandom(lastColor)
    return chalk[lastColor](instrument) + chalk.gray('>')
}

let lastColor

const startingInstrument = 'acoustic_grand_piano'

process.stdout.write('\x1B[2J')

piano.draw().on('end', () => {

    console.log(chalk.gray(`\nWelcome. Start playing with your MIDI controller, or map notes through ${chalk.green('play()')}`))
    console.log(chalk.gray(`Enter ${chalk.green('.keyboard')} to see a list of all commands`))

    const replServer = repl.start({ prompt: getPrompt(startingInstrument), ignoreUndefined: true, eval: evaluator })

    const historyFile = path.join(__dirname, '/../', '.node_keyboard_repl_history')

    // load history
    fs.readFile(historyFile, (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return console.error(err)
        } else if (err) {
            return fs.writeFile(err.path, '', 0, 0)
        }
        data.toString().split('\n').reverse().filter(line => line.trim()).map(line => replServer.history.push(line))
    })

    // append history on exit
    replServer.on('exit', () => {
        fs.appendFile(historyFile, '\n' + replServer.lines.join('\n'))
    })

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
            instructions.show()
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

    // attach functions to context
    Object.keys(functions).forEach(fncName => replServer.context[fncName] = functions[fncName].bind(replServer.context))

    // attach midi handler
    midi(replServer)

})


