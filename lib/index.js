'use strict';

const readline = require('readline');
const generateContext = require('./generateContext');
const instruments = require('./instruments');

const context = generateContext();

// instruments.ls();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let currentInstrument = 'acoustic_grand_piano'

rl.setPrompt(`${currentInstrument}>`)
rl.prompt()
rl.on('line', input => {
    input.split(' ').forEach(note => {
        instruments.get(context, currentInstrument).play(note)
    })
    rl.prompt();
})

