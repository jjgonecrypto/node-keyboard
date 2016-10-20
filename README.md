#node-keyboard

[![npm version](https://badge.fury.io/js/node-keyboard.svg)](https://badge.fury.io/js/node-keyboard)

A REPL where music is simply streams of input in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). Supports optional MIDI input.

![](https://media.giphy.com/media/l0MYPIsEjIrUFYNs4/giphy.gif)

##Install via

    npm install -g node-keyboard

##Run via

    node-keyboard

##Functionality tl;dr

* [MIDI In](#midi-in) support by `midiIn`, pipe to audio via `.pipe(toAudio())`
* [Create a stream](#create-a-stream) of notes using `from`
* [Delay playing](#delay) across a cycle of intervals via `.pipe(withDelay([...]))`

###MIDI In
Pipe the `midiIn` stream to a number of writable outputs. (*To function, your MIDI device must be on when node starts.*)

`toAudio()` will play the notes

```javascript
midiIn.pipe(toAudio())
```

`toRepl()` will output the notes in the REPL

```javascript
midiIn.pipe(toRepl())
```

`toPiano()` will draw the piano for each note played

```javascript
midiIn.pipe(toPiano())
```

Or pipe them through each other
`midiIn.pipe(toPiano()).pipe(toAudio())`

And remove from MIDI input via `midiIn.unpipe()`

![midis](https://cloud.githubusercontent.com/assets/799038/19424671/22718940-93f9-11e6-90fe-e0a6f8891299.gif)

###Create a Stream
Create an [infinite] stream of notes from an array using `from` (supports notes as variables).

```javascript
from(c, e, g).pipe(toAudio()) // Hit CTRL+C (SIGINT) to unpipe immediately
```

> Note: supports all notes A0 to Cs8/Db8 (Cs8 is the syntax-friendly version of 'C#8')

###Delay
Use `withDelay([...])` to return a transform stream that will emit after the given delays (where the delays are cycled)

```javascript
from(c1, g1, c2, g2, c3, g3).pipe(withDelay([250, 250, 500])).pipe(toAudio())
```

> Note: Breaking via CTRL+C will stop the stream by unpiping **everything**

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

###FAQ

1. When no octave is provided (e.g. `play(a)`) then 3rd octave (`a3` 220Hz) (starting at `c3` on an 8-octave piano) is the default.

2. `a0`, `bb0` (`a#0`) and `b0` are the only notes below `c1`

3. Sharp can be denoated by `s` when not surrounding note by strings (i.e. `as4 ==== 'a#4')`. Double-sharp is denoted with `x` as in `ax3` (enharmonically `b3`). Double-flat is denoted with `bb` as in `bbb3` (enharmonically `a3`)

###Acknowledgements

* The fantastic [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts) library for all the underlying recordings
* The stunning [teoria library](https://github.com/saebekassebil/teoria) for note, chord and scale support
