'use strict';

const path = require('path')
const clone = require('git-clone')

// download soundfonts (not on npm =(
clone('git@github.com:gleitz/midi-js-soundfonts.git', path.join(process.cwd(), 'midi-js-soundfonts'))
