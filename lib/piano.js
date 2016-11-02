'use strict'

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const Transform = require('stream').Transform

const colors = require('./colors')

const teoria = require('teoria')

const KEYMAP = [306, 125, 310, 129, 314, 318, 137, 322, 141, 326, 145, 330,
                334, 153, 338, 157, 342, 346, 165, 350, 169, 354, 173, 358]

exports.draw = note => {

    const input = fs.createReadStream(path.join(__dirname, './piano.txt'))

    let pitch

    if (note !== undefined) {
        pitch = (typeof note === 'number' ? note : teoria.note(note).midi()) % 24
    }

    const colorTransform = new Transform({
        transform(chunk, encoding, callback) {
            const mutated = chunk.toString().split('').map((c, i) => {

                if ([KEYMAP[pitch], KEYMAP[pitch] + 61, KEYMAP[pitch] + 122].indexOf(i) > -1) {
                    return chalk.red('■')
                } else if (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) {
                    const nextColor = colors.getRandom()
                    return chalk[nextColor](c)
                } else {
                    return c
                }
            })
            callback(null, '\x1B[2J\n' + mutated.join(''))
        }
    })

    const transformedInput = input.pipe(colorTransform)

    transformedInput.pipe(process.stdout)

    return transformedInput
}


