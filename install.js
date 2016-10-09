'use strict'

const path = require('path')
const clone = require('git-clone')

const soundfontsCloneSource = 'git@github.com:gleitz/midi-js-soundfonts.git'

// download soundfonts (because they aren't on npm) =(
console.log('Downloading soundfonts...')
console.log(`(cloning ${soundfontsCloneSource} to ${path.join(process.cwd(), 'midi-js-soundfonts')})`)

clone(soundfontsCloneSource, path.join(process.cwd(), 'midi-js-soundfonts'), () => {
    console.log('Download complete.')
})
