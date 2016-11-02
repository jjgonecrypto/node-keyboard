'use strict'

const repl = require('repl')
const fs = require('fs')
const path = require('path')

const chalk = require('chalk')

const rx = require('./rx')
const midi = require('./midi')
const piano = require('./piano')
const colors = require('./colors')
const instructions = require('./instructions')
const evaluator = require('./evaluator')
const mappers = require('./mappers')
const streams = require('./streams')

function getPrompt(greeting) {
    let lastColor
    const words = greeting.split('').map(c => {
        lastColor = colors.getRandom(lastColor)
        return chalk[lastColor](c)
    }).join('')

    return `${words}${chalk.gray('>')}`
}

piano.draw().on('end', () => {

    console.log(chalk.gray(`\nWelcome. Pipe ${chalk.green('midiIn.pipe(toAudio)')}, or map notes through ${chalk.green('play()')}`))
    console.log(chalk.gray(`Enter ${chalk.green('.keyboard')} to see a list of all commands`))

    const replServer = repl.start({ prompt: getPrompt('node-keyboard'), ignoreUndefined: true, eval: evaluator.eval })

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
        fs.appendFile(historyFile, replServer.lines.filter(l => l.replace(/\n/,'').length).join('\n') + '\n')
    })

    replServer.defineCommand('keyboard', {
        help: 'node-keyboard: See keyboard commands',
        action: function() {
            instructions.show()
            this.displayPrompt()
        }
    })

    // enable MIDI input if possible
    const midiIn = midi(replServer)
    if (midiIn) replServer.context.midiIn = midiIn

    // attach all stream factories to context (with getter contexts)
    Reflect
        .ownKeys(streams)
        .map(key => {
            return { pd: Reflect.getOwnPropertyDescriptor(streams, key), key }
        })
        .forEach(({ pd, key }) => Reflect.defineProperty(replServer.context, key, pd))

    // attach all mapping functions (flatten any getters)
    Object.assign(replServer.context, mappers)

    // utility function to allow imported scripts to run
    replServer.context.runInThisContext = evaluator.runInThisContext

    const Rx = rx()

    // On .break (CTRL+C), unpipe everything, just in case
    replServer.on('SIGINT', () => {
        if (midiIn) midiIn.unpipe()
        streams.unpipeAll()
        Rx.cleanup()
    })

    replServer.context.Rx = Rx
})



