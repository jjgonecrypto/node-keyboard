#node-keyboard

A REPL to play music in node. Uses the awesome soundfonts of [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts). 

![image](https://cloud.githubusercontent.com/assets/799038/15515842/0786779c-21be-11e6-9e34-78c05c179b7f.png)

##Install via

    npm install -g node-keyboard

##Run via

    node-keyboard

##Functionality tl;dr

* [Play notes](#play-notes) using default instrument via `play(note: String)`
* [Explode chords](#chord) into an array of notes via `chord(name: String)` 
* [See all available instruments](#see-available-instruments) with `.all`
* [Switch default instrument](#switch-default-instrument) with `.using instrument: String`
* [Map notes to an instrument](#switch-instrument-per-note) with `using(instrument: String)`
    * or play notes with instrument via `play({ note: String, instrument: String})`

###Play Notes

Apply the `play` function to a note as a string, eg:

```javascript
['c3', 'e6', 'g7', 'e4'].forEach(play) // C
```
![image](https://cloud.githubusercontent.com/assets/799038/15515306/84b4e0f8-21bb-11e6-96a9-7a0917b9eb25.png)

```javascript
['a', 'c', 'e'].forEach(play) // am
```
![image](https://cloud.githubusercontent.com/assets/799038/15515351/bdccfa74-21bb-11e6-8140-c1f6fcb11282.png)

```javascript
['e3', 'g#4', 'b6', 'e7', 'd5'].forEach(play) // E7
```
![image](https://cloud.githubusercontent.com/assets/799038/15515362/d3c5f7fe-21bb-11e6-8a97-815e79b0fa16.png)

```javascript
['c2', 'eb2', 'g2', 'eb2', 'c2'].forEach((note, i) => setTimeout(() => play(note), i * 500)) // cm triad
```
![image](https://cloud.githubusercontent.com/assets/799038/15515393/013e2a80-21bc-11e6-8819-553e5f835fce.png)

###Chords
Use `chord` function to explode a chord into an array of notes

```javascript
chord('fdim7').forEach(play)
```
![image](https://cloud.githubusercontent.com/assets/799038/15634513/018c8d52-2594-11e6-9315-b390b1c6e637.png)

```javascript
chord('g13').forEach(play)
```
![image](https://cloud.githubusercontent.com/assets/799038/15634521/26cf7ca0-2594-11e6-9f61-28b8e8fd969d.png)

###See Available Instruments
Use `.all` to see a list of available instruments

![image](https://cloud.githubusercontent.com/assets/799038/15515672/624c272c-21bd-11e6-884b-25984cb2c1b7.png)

###Default Instrument
Use `.use [instrumentName]` to switch default instrument. E.g. `.use guitar` or `.use horn`.

![image](https://cloud.githubusercontent.com/assets/799038/15515555/b4a01b92-21bc-11e6-8d4d-355a530273ce.png)

###Switch Instrument per Note
Apply the `using` map function to change instrument on a chord

```javascript
['f#1', 'a4', 'c', 'eb2', 'f#5'].map(using('trumpet')).forEach(play) // fdim7
```
![image](https://cloud.githubusercontent.com/assets/799038/15515450/4ef16fa8-21bc-11e6-9264-deea8906e83c.png)

```javascript
['f#', 'c#'].map(using('bass')).concat(['a', 'f#5'].map(using('guitar'))).forEach(play) // f#m
```
![image](https://cloud.githubusercontent.com/assets/799038/15515502/83dfe5a0-21bc-11e6-98e7-0626f0db9707.png)

###FAQ

1. When no octave is provided (e.g. `play('a')`) then 3rd octave (`a3` 220Hz) (starting at `c1` on an 8-octave piano) is the default.

2. `a0`, `bb0` (`a#0`) and `b0` are the only notes below `c1`

3. Double-sharp is denoted with `x` as in `ax3` (enharmonically `b3`). Double-flat is denoted with `bb` as in `bbb3` (enharmonically `a3`)
