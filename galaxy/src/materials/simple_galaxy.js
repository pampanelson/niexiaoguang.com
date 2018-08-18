import { RawShaderMaterial } from 'three'

const hmr = require('../lib/three-hmr.js')
const cache = hmr.cache(__filename)
const glslify = require('glslify')

const vertexShader = glslify('./shaders/simple_galaxy.vert')
const fragmentShader = glslify('./shaders/simple_galaxy.frag')


export function init(opt) {
    const material = new RawShaderMaterial({
        uniforms: {
            time: {
                type: 'f',
                value: opt.time
            },
            screenw: {
                type: 'f',
                value: opt.screenw
            },
            screenh: {
                type: 'f',
                value: opt.screenh
            },
            spectrum:{
              type:'fv1',
              value:opt.spectrum
            }
        },
        vertexShader,
        fragmentShader
    })
    hmr.enable(cache, material)
    return material
}

if (module.hot) {
    module.hot.accept(err => {
        if (err) throw errr
    })
    hmr.update(cache, {
        vertexShader,
        fragmentShader
    })
}