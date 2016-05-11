'use strict'

const path = require('path');

const clone = require('git-clone')
clone('git@github.com:gleitz/midi-js-soundfonts.git', path.join(process.cwd(), 'node_modules', 'midi-js-soundfonts'));
