#node-keyboard

A REPL to play music in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). 

![image](https://cloud.githubusercontent.com/assets/799038/15271241/2b316c46-1a0d-11e6-8a84-a2eda7ac51b6.png)

###Run via

    node keyboard


###Instructions

* Apply the `play` function to a note as a string, eg:
    * (C Major) > `['c3', 'e6', 'g7', 'e4'].forEach(play)`
    * (A minor) > `['a', 'c', 'e'].forEach(play)`
    * (E7) > `['e3', 'g#4', 'b6', 'e7', 'd5'].forEach(play)`
    * (C Minor triad) `['c2', 'eb2', 'g2', 'eb2', 'c2'].forEach((note, i) => setTimeout(() => play(note), i * 500))`

* Use `.all` to see a list of available instruments

* Use `.use [instrumentName]` to switch instrument. E.g. `.use guitar` or `.use horn`.

> When no octave is provided (e.g. `play('a')`) then 4th octave (`a3` 220Hz) (starting at `a0` on an 8-octave piano) is the default.
