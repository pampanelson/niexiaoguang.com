precision mediump float;

// glslify fancy imports demo
// import noise from 'glsl-noise/simplex/3d';
uniform float time;
varying vec2 vUv;
uniform float screenw;
uniform float screenh;
uniform float spectrum[32];
// void main () {
//   // glslify-hex allows for the color strings
//   vec3 color = vec3(sin(time), sin(time)/vUv.y, cos(time)/vUv.x);
//   gl_FragColor = vec4(color, 1.0);
// }
#define round(x, f) (floor((x)/(f) + 0.5) * (f))

float random(float p)
{
    return fract(52.043*sin(p*205.429));
}
float random2(float p)
{
    return random(p)*2.0-1.0;
}
// http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
float field(in vec3 p) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 32; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}

float field2(in vec3 p, float s) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
	float accum = s/4.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 18; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.2));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}

vec3 nrand3( vec2 co )
{
	vec3 a = fract( cos( co.x*8.3e-3 + co.y )*vec3(1.3e5, 4.7e5, 2.9e5) );
	vec3 b = fract( sin( co.x*0.3e-3 + co.y )*vec3(8.1e5, 1.0e5, 0.1e5) );
	vec3 c = mix(a, b, 0.5);
	return c;
}

// meteor 
vec3 meteor(vec2 uv, float gtime, float delay,vec2 iResolution)
{
    float seed = round(gtime, delay);
    
    float startTime = (delay - 1.5) * random(seed);
    float time = max(0.0, min(1.0, gtime-seed - startTime));
    
    vec2 start = vec2(
        random2(seed),
        0.7 + 0.3 * random(seed - 5.5)
    );
    
    vec2 end = start * 0.5;
    
    uv = uv - mix(start, end, time);
    
    end = normalize(end - start);
    uv = uv * mat2(end.x, end.y, -end.y, end.x);
    uv.x *= 0.1;
    // 20.0 control meteor shape
    float alpha = 20.0 * pow(time, 2.0) * pow(time - 1.0, 2.0);
    return vec3(max(0.0, alpha - iResolution.y * length(uv)));
}

// vec3 meteorstorm(vec2 uv,float time,vec2 iResolution)
// {
//     return
//         meteor(uv, time,0.0,iResolution) +
//         meteor(uv, time + 15.3, 15.459,iResolution) +
//         meteor(uv, time + 125.0, 31.2,iResolution);
// }


void main() {
	vec2 iResolution = vec2(screenw,screenh);

	// vec2 uv = 2. * vUv.xy / iResolution.xy - 1.; // original 
	vec2 uv = -1. + 2. * vUv; // trick to fit three.js 
	vec2 uvs = uv * iResolution.xy / max(iResolution.x, iResolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	p += .2 * vec3(sin(time / 16.), sin(time / 12.),  sin(time / 128.));
	float t = field(p);
	float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));

	  // Second Layer
	vec3 p2 = vec3(uvs / (4.+sin(time*0.11)*0.2+0.2+sin(time*0.15)*0.3+0.4), 1.5) + vec3(2., -1.3, -1.);
	p2 += 0.25 * vec3(sin(time / 16.), sin(time / 12.),  sin(time / 128.));
	float t2 = field2(p2,1.);
	vec4 c2 = mix(.4, 1., v) * vec4(1.3 * t2 * t2 * t2 * (1.0 + spectrum[10]),
		1.8  * t2 * t2 * (0.5 - spectrum[20]), 
		t2* (1.0 - spectrum[30]), 
		t2);
	



	//Let's add some stars
	//Thanks to http://glsl.heroku.com/e#6904.0
	vec2 seed = p.xy * 2.0;	
	seed = floor(seed * iResolution.x);
	vec3 rnd = nrand3( seed );
	vec4 starcolor = vec4(pow(rnd.y,35.0));
	
	// time * meteor speed, bigger is quicker 0.5 ~ 1.0
	float meteorSpeed = 0.8;
	// meteor delay controls frequence of meteor 0.6 ~ 3.6,smaller is higher frequence
	float meteorDelay = 2.8;
	vec2 meteorPos = uv;
	vec4 meteor = vec4(meteor(meteorPos,time * meteorSpeed,meteorDelay,iResolution),1.0);
	gl_FragColor = 
		mix(.4, 1., v) * vec4(1.8 * t * t * t, 1.4 * t * t, t, 1.0) + 

		meteor +
		c2 + 
		// vec4(meteorstorm(meteorUv,time,iResolution),1.0) +
		// vec4(spectrum[31] * spectrum[21] * spectrum[11] * spectrum[1]
		// 	,spectrum[4] * spectrum[5] * spectrum[6] * spectrum[7]
		// 	,spectrum[8] * spectrum[9] *spectrum[10] *spectrum[11]
		// 	,spectrum[12] *spectrum[13] *spectrum[14] *spectrum[15] 
		// 	) * 0.3 +
		starcolor;

	if(1.2 * spectrum[2] < 0.3){
		gl_FragColor *= 0.3;
	}
	else{
		gl_FragColor *= 1.2 * spectrum[9];

	}


}