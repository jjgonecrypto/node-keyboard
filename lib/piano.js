'use strict'

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const Transform = require('stream').Transform

const colors = require('./colors')

const teoria = require('teoria')

const KEYMAP = [211, 87, 215, 91, 219, 223, 99, 227, 103, 231, 107, 235]

exports.draw = note => {

    const input = fs.createReadStream(path.join(__dirname, './piano.txt'))

    let pitch = note ? teoria.note(note).midi() % 12 : undefined

    const colorTransform = new Transform({
        transform(chunk, encoding, callback) {
            const mutated = chunk.toString().split('').map((c, i) => {

                if ([KEYMAP[pitch], KEYMAP[pitch] + 42, KEYMAP[pitch] + 84].indexOf(i) > -1) {
                    return chalk.red('*')
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


