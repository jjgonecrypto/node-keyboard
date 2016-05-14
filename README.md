#node-keyboard

A REPL to play music in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). 


###Run via

    node keyboard


###Instructions

* Apply the `play` function to a note as a string, eg:
    * (C Major) > `['c3', 'e6', 'g7', 'e4'].forEach(play)`
    * (E7) > `['e3', 'ab4', 'b6', 'e7', 'd5'].forEach(play)` 

* Use `.all` to see a list of available instruments

* Use `.use [instrumentName]` to switch instrument. E.g. `.use guitar` or `.use horn`.

> Note: #'s aren't currently supported - you must use flats.
