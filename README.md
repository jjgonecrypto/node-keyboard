#node-keyboard

[![npm version](https://badge.fury.io/js/node-keyboard.svg)](https://badge.fury.io/js/node-keyboard)

A REPL where music is simply streams of input in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). Supports optional MIDI input.

![](https://media.giphy.com/media/l0MYPIsEjIrUFYNs4/giphy.gif)

##Install via

    npm install -g node-keyboard

##Run via

    node-keyboard

##Examples
Inside the REPL, the examples in the example folder are loaded as getters with the prefix `example_`. E.g. `example_01_scales.chromatic({ key: 'b', ms: 100 })`

##Streaming Functionality tl;dr

* [MIDI In](#midi-in) support by `midiIn`, pipe to audio via `.pipe(toAudio)`
* [Create a stream](#create-a-stream) of notes using `from`
* [Delay playing](#delay) across a cycle of intervals via `.pipe(delay(...))`
* [Select instrument](#with-instrument) or play with a random one via `.pipe(on(...))`

###MIDI In
Pipe the `midiIn` stream to a number of writable outputs. (*To function, your MIDI device must be on when node starts.*)

`toAudio` will play the notes

```javascript
midiIn.pipe(toAudio)
```

`toRepl` will output the notes in the REPL

```javascript
midiIn.pipe(toRepl)
```

`toPiano` will draw the piano for each note played

```javascript
midiIn.pipe(toPiano)
```

`toLogger` will console log the note (pipe after `toAudio` to see more information about the played note)

```javascript
midiIn.pipe(toLogger)
```

Or pipe them through each other
`midiIn.pipe(toPiano).pipe(toAudio)`

And remove from MIDI input via `midiIn.unpipe()` (or `CTRL`+`C`)

![node-keyboard](https://cloud.githubusercontent.com/assets/799038/20159751/b75032b8-a6b0-11e6-92ed-6b91814647f3.gif)

###Create a Stream
Create an [infinite] stream of notes from an array using `from` (supports notes as variables).

```javascript
from(c, e, g).pipe(toAudio) // Hit CTRL+C (SIGINT) to unpipe immediately
```

> Note: supports all notes A0 to Cs8/Db8 (Cs8 is the syntax-friendly version of 'C#8')

###Delay
Use `delay(...args)` to return a transform stream that will emit after the given delays (where the delays are cycled)

```javascript
from(c1, g1, c2, g2, c3, g3).pipe(delay(250, 250, 500)).pipe(toAudio)
```

###With Instrument
Use `on(instrument)` to return a transform stream that will ensure the given instrument is used.

```javascript
from(c,e,g).pipe(on('guitar')).pipe(delay(200)).pipe(toAudio)
```

> Note: Breaking via CTRL+C will stop the stream by unpiping **everything**

##Functionality (sans streams)
Functionality, without the streams.

###Properties
* `instruments` list all instruments available
* `scales` list all scales supported

###Side effects
* `play(note)` plays a note.
Eg.
```javascript
[c,e,g].forEach(play)
```

* `piano(note)` draws the piano playing that note
Eg.
```javascript
[c,e,g].forEach((note, i) => setTimeout(() => piano(note), 400 * i))
```

* `log(note)` logs the note to `stdout`. (Includes the instrument if chained after `play`)
Eg.
```javascript
[f,a,c].map(play).forEach(log)
```

###Projections
* `chord(name)` projects a chord name out to an array of notes. 
Eg.
```javascript
chord('cm9')
// [ 'c4', 'eb4', 'g4', 'bb4', 'd5' ]
```

* `scale(note, name)` projects a note through the named scale
Eg.
```javascript
scale('a', 'flamenco')
// [ 'a5', 'bb5', 'c#6', 'd6', 'e6', 'f6', 'g#6' ]
```

* `sequence(note, ...semitones)` projects a note through the given semitone sequence
Eg.
```javascript
sequence(c, 2, 1, 2, 2, 1, 2, 2) // c minor scale
// [ 'c3', 'd3', 'eb3', 'f3', 'g3', 'g#3', 'a#3', 'c4' ]
```

###Functors
* `instrument([name]])` returns mapping function to play on instrument. If no parameter provided it chooses a random instrument.
Eg.: 
```javascript
[c,e,g].map(instrument('guitar')).forEach(play)
```

* `interval(...intervals)` returns mapping function to project intervals.
Eg. 
```javascript
[c,e,g].map(interval('P1','P5')).reduce((acc, cur) => acc.concat(cur), [])
// [ 'c3', 'g3', 'e3', 'b3', 'g3', 'd4' ]
```

* `only(...numbers)` returns filter predicate to filter out to required interval positions.
Eg.
```javascript
scale(c, 'major').filter(only(1,3,5,7)).map(play) // Cmaj7
```

-------

##Known Issues
* Reusing a stream and repiping it through transformers
E.g. 
```javascript
let guitar = from(c,e,g).pipe(on('guitar')).pipe(delay(200))
guitar.pipe(toAudio) 
// CTRL+C
guitar.pipe(toAudio) // works
// CTRL+C
guitar.pipe(on()).pipe(toAudio) // works first time only
// CTRL+C
guitar.pipe(on()).pipe(toAudio) // won't play the guitar stream's final on() is still piped to the previous on()
```

-------

##Changelog

* ~~(see [commit log](https://github.com/justinjmoses/node-keyboard/commits/master) for earlier releases)~~
* ~~`2.5.0` Support for switching instruments~~
* ~~`2.5.5` Adding `every`~~
* ~~`2.6.0` Persistent history for the REPL~~
    * ~~`2.6.1` Adding eslint and ensuring `play` returns input~~
* ~~`2.7.0` Support for MIDI input~~
* ~~`2.8.0` Support for notes as first-class objects (Symbol-like)~~
* ~~`2.9.0` Support for midi streams: `midiIn`, `toRepl`, `toAudio` and `toPiano`~~
* ~~`3.0.0` Upgraded to stream-first, all stream variables are now factory functions (to reuse). Support for fromArray. Deprecated older array functionality.~~
* ~~`3.1.0` Renamed `fromArray` to `from`, allow `from` to continue forever, limited `withDelay` to have a highWaterMark of 1 and play first immediately, brought in SIGINT support to unpipe streams when CTRL+C pressed~~
* ~~`3.2.0` Renamed `withDelay` to `delay`. Added `toLogger`. Added `on` to play instruments.~~
* ~~`3.3.0` Added base functions `chord()`, `scale`,  functors `instrument()` anf `interval()`, and properties `instruments` and `scales`. Many bug fixes.~~
* ~~`3.4.0` Migrated to using getters for writable streams for brevity~~
* ~~`3.5.0` Support for `only()`~~
* ~~`3.6.0` Subscription removal on SIGINT for Rx, support for `piano` function, support for `runInThisContext`, and stream getter bugfix~~
* ~~`3.7.0` Support for `log` function, removal of `runInThisContext` (not necessary)~~
* ~~`3.8.0` Errors no longer thrown, just shown. Support for examples~~

###FAQ

1. When no octave is provided (e.g. `play(a)`) then 3rd octave (`a3` 220Hz) (starting at `c3` on an 8-octave piano) is the default.

2. `a0`, `bb0` (`a#0`) and `b0` are the only notes below `c1`

3. Sharp can be denoated by `s` when not surrounding note by strings (i.e. `as4 ==== 'a#4')`. Double-sharp is denoted with `x` as in `ax3` (enharmonically `b3`). Double-flat is denoted with `bb` as in `bbb3` (enharmonically `a3`)

###Acknowledgements

* The fantastic [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts) library for all the underlying recordings
* The stunning [teoria library](https://github.com/saebekassebil/teoria) for note, chord and scale support
