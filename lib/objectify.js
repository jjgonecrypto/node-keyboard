'use strict'

module.exports = chunk => {
    if (typeof chunk !== 'string') return chunk

    return {
        input: chunk
    }
}
