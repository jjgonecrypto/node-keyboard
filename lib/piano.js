'use strict'

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const Transform = require('stream').Transform

const colors = require('./colors')

exports.draw = () => {

    const input = fs.createReadStream(path.join(__dirname, './piano.txt'))

    const colorTransform = new Transform({
        transform(chunk, encoding, callback) {
            const mutated = chunk.toString().split('').map(c => {
                if (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122) {
                    const nextColor = colors.getRandom()
                    return chalk[nextColor](c)
                } else {
                    return c
                }
            })
            callback(null, mutated.join(''))
        }
    })

    const transformedInput = input.pipe(colorTransform)

    transformedInput.pipe(process.stdout)

    return transformedInput
}


