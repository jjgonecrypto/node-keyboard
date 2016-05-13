'use strict';

const AudioContext = require('web-audio-api').AudioContext
const Speaker = require('speaker')

module.exports = function() {
    const context = new AudioContext()
    context.outStream = new Speaker({
      channels: context.format.numberOfChannels,
      bitDepth: context.format.bitDepth,
      sampleRate: context.sampleRate
    })
    return context
}
