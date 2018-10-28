import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
// import '../node_modules/p5/lib/addons/p5.sound.js'

var sketch = (p) => {
    // window.myP5 = p
    p.preload = (songfile) => {
        p.loadSound(songfile)

    }
    let amp = new p5.Amplitude()
    let fft = new p5.FFT()

}
export const myP5 = new p5(sketch)
// let song
// let rms
// let fft
// export function preload(songfile) {
//     song = loadSound(songfile)
//     // song.loop()

//     // level
//     rms = new p5.Amplitude()
//     rms.setInput(song)

//     // spectrum
//     fft = new p5.FFT()
//     fft.setInput(song)

// }

// export function setup() {
//     rms = new p5.Amplitude()
//     rms.setInput(song)

//     // spectrum
//     fft = new p5.FFT()
//     fft.setInput(song)
// }
// export function play() {
//     song.play()
// }

// export function stop() {
//     song.stop()
// }

// export function getAmplitude() {
//     return rms.getLevel()

// }
// export function getSpectrum() {
//     return fft.analyze()
// }