'use strict';

const repl = require('repl');
const chalk = require('chalk');

const generateContext = require('./generateContext');
const instruments = require('./instruments');

const context = generateContext();

// instruments.ls();
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

let currentInstrument = 'acoustic_grand_piano'

const allInstruments = instruments.collection()

// function prompt() {
//     rl.setPrompt(`${currentInstrument}>`)
//     rl.prompt()
// }

let COLORS = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray'];

let lastColor;

function getPrompt() {
    let randomIndex = Math.floor(Math.random() * COLORS.length);
    if (COLORS[randomIndex] === lastColor) randomIndex = randomIndex + 1 % COLORS.length
    lastColor = COLORS[randomIndex]
    return chalk[lastColor](`${currentInstrument}`) + chalk.gray('>')
}

let replServer = repl.start(getPrompt())

replServer.defineCommand('instruments', {
    help: 'See all instruments',
    action: function() {
        console.log(chalk.gray(allInstruments.join('\n')))
        this.displayPrompt()
    }
})

replServer.defineCommand('use', function(newInstrument) {
    currentInstrument = allInstruments.find(i => new RegExp(newInstrument, 'i').test(i)) || currentInstrument
    replServer.setPrompt(getPrompt())
    this.displayPrompt()
})


// rl.on('line', input => {
//     if (/^with /.test(input)) {
//         const newInstrument = (input.match(/^with (.+)/) || [])[1];

//         currentInstrument = allInstruments.find(i => new RegExp(newInstrument, 'i').test(i)) || currentInstrument
//     } else if (/instruments/i.test(input)) {

//         console.log(allInstruments.join('\n'))
//     } else {
//         input.split(' ').forEach(note => {
//             instruments.get(context, currentInstrument).play(note)
//         })
//     }
//     prompt()
// })

// process.stdout.write("\x1B[2J")

// console.log('---------------------------------------------------------------')
// console.log('Welcome. To play music, enter the notes space-delimited, as in:')
// console.log('---------------------------------------------------------------')

// console.log('C Major');
// console.log('> c2 e7 g5 e4');
// console.log()
// console.log('Eb minor');
// console.log('> eb3 gb5 bb7');
// console.log('---------------------------------------------------------------')
// console.log('To see other instruments, type "instruments"')
// console.log('---------------------------------------------------------------')
// console.log('To change instrument, type "with [instrument]", where [instrument] is a part of any instrument name')
// console.log('---------------------------------------------------------------')



// prompt()
