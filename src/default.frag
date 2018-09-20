precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uTexture;

void main(void) {
    gl_FragColor = texture2D(uTexture, vUv);
    gl_FragColor.xyz *= max(dot(vNormal, normalize(vec3(0, 4, 1.5))), 0.);
}