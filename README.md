#node-keyboard

A REPL where music is simply streams of input in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). Supports optional MIDI input.

![](https://media.giphy.com/media/l0MYPIsEjIrUFYNs4/giphy.gif)

##Install via

    npm install -g node-keyboard

##Run via

    node-keyboard

##Releases

[![npm version](https://badge.fury.io/js/node-keyboard.svg)](https://badge.fury.io/js/node-keyboard)

* ~~(see [commit log](https://github.com/justinjmoses/node-keyboard/commits/master) for earlier releases)~~
* ~~`2.5.0` Support for switching instruments~~
* ~~`2.5.5` Adding `every`~~
* ~~`2.6.0` Persistent history for the REPL~~
    * ~~`2.6.1` Adding eslint and ensuring `play` returns input~~
* ~~`2.7.0` Support for MIDI input~~
* ~~`2.8.0` Support for notes as first-class objects (Symbol-like)~~ 
* ~~`2.9.0` Support for midi streams: `midiIn`, `toRepl`, `toAudio` and `toPiano`~~
* ~~`3.0.0` Upgraded to stream-first, all stream variables are now factory functions (to reuse). Support for fromArray. Deprecated older array functionality.~~

##Functionality tl;dr

* [MIDI In](#midi-in) support by `midiIn`
* Create a stream of notes using `fromArray`
* [Play notes](#play-notes) using default instrument via `fromArray([c, e, g]).pipe(toAudio())` 
* [Delay playing](#delay) across a cycle of intervals via `.pipe(withDelay([...]))`

**Legacy array functionality**
* [Delay playing](#delay-playing) by mapping via `every(interval: Number)`
* [Explode chords](#chords) into an array of notes via `chord(name: String)` 
* [Project scales](#scales) into an array of notes via `scale(note: String|Symbol, scale: String)`
* [See all available instruments](#see-available-instruments) with `.all`
* [Switch default instrument](#default-instrument) with `.using instrument: String`
* [Map notes to an instrument](#switch-instrument-per-note) with `using(instrument: String)`
    * or play notes with instrument via `play({ note: String|Symbol, instrument: String})`

###MIDI In
Pipe the `midiIn` stream to a number of writable outputs. (*To function, your MIDI device must be on when node starts.*)

`toAudio()` will play the notes

```javascript
midiIn.pipe(toAudio())
```
![toaudio](https://cloud.githubusercontent.com/assets/799038/19413555/987fd1f6-92fe-11e6-8349-1b667b98d3c5.gif)

`toRepl()` will output the notes in the REPL

```javascript
midiIn.pipe(toRepl())
```
![torepl](https://cloud.githubusercontent.com/assets/799038/19413562/006e96da-92ff-11e6-85b7-265a954c7d91.gif)

`toPiano()` will draw the piano for each note played

```javascript
midiIn.pipe(toPiano())
```
![topiano](https://cloud.githubusercontent.com/assets/799038/19414500/edf886e6-931c-11e6-88c1-2a9adb452c87.gif)

Or pipe them through each other
`midiIn.pipe(toPiano()).pipe(toAudio())`

And remove from MIDI input via `midiIn.unpipe()`

> Note: 

###Create a Stream
Create a stream of notes from an array using `fromArray` (supports notes as variables)

```javascript
fromArray([c, e, g]).pipe(toAudio())
```

> Note: supports all notes A0 to Cs8/Db8 (Cs8 is the syntax-friendly version of 'C#8')

###Delay
Use `withDelay([...])` to return a transform stream that will emit after the given delays (where the delays are cycled)

```javascript
fromArray([c1, g1, c2, g2, c3, g3]).pipe(withDelay([250, 250, 500])).pipe(toAudio())
```

-------

## Legacy Array Functionality

###Play Notes
Apply the `play` function to a note as a string, eg:

```javascript
[c3, e6, g7, e4].forEach(play) // C
```

```javascript
[a, c, e].forEach(play) // am
```

```javascript
[e3, gs4, b6, e7, d5].forEach(play) // E7
```
![play](https://cloud.githubusercontent.com/assets/799038/19295180/c3024d74-9000-11e6-8f2f-9be94045450d.gif)

> Note: supports all notes A0 to Cs8/Db8 (Cs8 is the syntax-friendly version of 'C#8')

###Delay Playing
Map with `every` function to delay playing

```javascript
[fs3, as4, cs5, fs6].map(every(500)).forEach(play) // F# triad
```
![triad](https://cloud.githubusercontent.com/assets/799038/19295213/029745e8-9001-11e6-86a0-b981e30d4ae8.gif)

###Chords
Use `chord` function to explode a chord into an array of notes

```javascript
chord('fdim7').forEach(play)
```

```javascript
chord('g13').forEach(play)
```
![chord](https://cloud.githubusercontent.com/assets/799038/19295117/5f1f9e92-9000-11e6-9c12-0a3e13e698eb.gif)

###Scales
Use `scale` function to project a scale into an array of notes

```javascript
scale(a, 'harmonicminor').map(every(250)).forEach(play)
```

```javascript
scale(g2, 'mixolydian').map(every(500)).forEach(play)
```
![scale](https://cloud.githubusercontent.com/assets/799038/19294976/457163d2-8fff-11e6-9517-c28868164a6e.gif)

> For the list of all supported scales, type `.scales`

###See Available Instruments
Use `.all` to see a list of available instruments

![image](https://cloud.githubusercontent.com/assets/799038/15515672/624c272c-21bd-11e6-884b-25984cb2c1b7.png)

###Default Instrument
Use `.use [instrumentName]` to switch default instrument. E.g. `.use guitar` or `.use horn`.

![image](https://cloud.githubusercontent.com/assets/799038/15515555/b4a01b92-21bc-11e6-8d4d-355a530273ce.png)

###Switch Instrument per Note
Apply the `using` map function to change instrument on a chord

```javascript
[fs1, a4, c, eb2, fs5].map(using('trumpet')).forEach(play) // fdim7
```

```javascript
[fs, cs].map(using('bass')).concat([a, fs5].map(using('guitar'))).forEach(play) // f#m
```
![using](https://cloud.githubusercontent.com/assets/799038/19295078/1c62ea28-9000-11e6-950d-91371f657e01.gif)


###FAQ

1. When no octave is provided (e.g. `play(a)`) then 3rd octave (`a3` 220Hz) (starting at `c3` on an 8-octave piano) is the default.

2. `a0`, `bb0` (`a#0`) and `b0` are the only notes below `c1`

3. Sharp can be denoated by `s` when not surrounding note by strings (i.e. `as4 ==== 'a#4')`. Double-sharp is denoted with `x` as in `ax3` (enharmonically `b3`). Double-flat is denoted with `bb` as in `bbb3` (enharmonically `a3`)

###Acknowledgements

* The fantastic [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts) library for all the underlying recordings
* The stunning [teoria library](https://github.com/saebekassebil/teoria) for note, chord and scale support
