import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Audio,
    AudioListener,
    AudioLoader,
    AudioAnalyser,
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    Clock
} from 'three';

// const noiseMaterial = require('./materials/demo_noise.js')
// const inlineMaterial = require('./materials/demo_inline.js')
let time = 0.0
const clock = new Clock()
let myUniforms = {}
myUniforms.screenw = window.innerWidth * 1.
myUniforms.screenh = window.innerHeight * 1.
myUniforms.time = 0
myUniforms.spectrum = []

// handle screen resize
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

}
const galaxyMaterial = require('./materials/simple_galaxy.js').init(myUniforms)

const mesh = new Mesh(new PlaneGeometry(window.innerWidth * 1.5, window.innerHeight * 1.5), galaxyMaterial)
const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 500
let cameraZSpeed = 0.1
const listener = new AudioListener()
camera.add(listener)

const sound = new Audio(listener)
const audioLoader = new AudioLoader()

// all statis file put int /dist folder ===============
audioLoader.load('./assets/moonlight_demo.mp3', function(buffer) {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(0.5)
    sound.play()
})

// 64 / 2 = 32 size array
const analyser = new AudioAnalyser(sound, 64)

scene.add(mesh)

export function render() {
    requestAnimationFrame(render)
    let rawSoundDynamics = analyser.getFrequencyData()
    // console.log(rawSoundDynamics)
    let soundDynamics = []
    rawSoundDynamics.forEach((floatValue) => {
        soundDynamics.push(floatValue / 255)
    })
    let cameraZ = camera.position.z
    if (cameraZ > 600) {
        cameraZ -= cameraZSpeed
    } else if (cameraZ < 501) {
        camera.position.z += cameraZSpeed
    }
    // console.log(soundDynamics)
    galaxyMaterial.uniforms.spectrum.value = soundDynamics
  
    galaxyMaterial.uniforms.time.value += clock.getDelta() / 3.0
    renderer.render(scene, camera)
}
