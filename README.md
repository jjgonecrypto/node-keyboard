#node-keyboard

A REPL to play music in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). 

![image](https://cloud.githubusercontent.com/assets/799038/15271241/2b316c46-1a0d-11e6-8a84-a2eda7ac51b6.png)

###Install via

    npm install -g node-keyboard

###Run via

    node-keyboard

###Instructions

* Apply the `play` function to a note as a string, eg:
    * (C Major) > `['c3', 'e6', 'g7', 'e4'].forEach(play)`
    * (A minor) > `['a', 'c', 'e'].forEach(play)`
    * (E7) > `['e3', 'g#4', 'b6', 'e7', 'd5'].forEach(play)`
    * (C Minor triad) `['c2', 'eb2', 'g2', 'eb2', 'c2'].forEach((note, i) => setTimeout(() => play(note), i * 500))`

* Apply the `using` map function to change instrument on a chord
    * (f dim 7) > `['f#1', 'a4', 'c', 'eb2', 'f#5'].map(using('trumpet')).forEach(play)`
    * get creative (f#m) `['f#', 'c#'].map(using('bass')).concat(['a', 'f#5'].map(using('guitar'))).forEach(play)`

* Use `.all` to see a list of available instruments

* Use `.use [instrumentName]` to switch default instrument. E.g. `.use guitar` or `.use horn`.

> When no octave is provided (e.g. `play('a')`) then 3rd octave (`a3` 220Hz) (starting at `c1` on an 8-octave piano) is the default.

> `a0`, `bb0` (`a#0`) and `b0` are the only notes below `c1`
