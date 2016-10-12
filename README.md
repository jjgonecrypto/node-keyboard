#node-keyboard

A REPL to play music in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). Supports MIDI input.

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

##Functionality tl;dr

* [Play notes](#play-notes) using default instrument via `play(note: String|Symbol)` 
* [Delay playing](#delay-playing) by mapping via `every(interval: Number)`
* [Explode chords](#chords) into an array of notes via `chord(name: String)` 
* [Project scales](#scales) into an array of notes via `scale(note: String|Symbol, scale: String)`
* [See all available instruments](#see-available-instruments) with `.all`
* [Switch default instrument](#default-instrument) with `.using instrument: String`
* [Map notes to an instrument](#switch-instrument-per-note) with `using(instrument: String)`
    * or play notes with instrument via `play({ note: String|Symbol, instrument: String})`

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
