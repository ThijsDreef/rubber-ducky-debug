precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying float vHeight;

const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
const vec3 SEA_WATER_COLOR = vec3(0.7,0.7,0.75);

void main(void) {
    gl_FragColor = vec4(mix(SEA_BASE, SEA_WATER_COLOR, vHeight), 1.);
    gl_FragColor.xyz *= max(dot(vNormal, normalize(vec3(0, 4, 1.5))), 0.);
    // gl_FragColor.xyz = vNormal;
}