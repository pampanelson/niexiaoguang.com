precision mediump float;

// glslify fancy imports demo
// import noise from 'glsl-noise/simplex/3d';
uniform float time;
varying vec2 vUv;

void main () {
  float n = noise(vec3(vUv.xy * time, 2.0));
  n = smoothstep(0.0, 0.1, n);

  // glslify-hex allows for the color strings
  vec3 color = mix(vec3(#06C8C4), vec3(#8F51B5), n);
  gl_FragColor = vec4(color, 1.0);
}
	