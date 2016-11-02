'use strict'

module.exports = chunk => {
    if (typeof chunk === 'object') return chunk

    return {
        input: chunk
    }
}
