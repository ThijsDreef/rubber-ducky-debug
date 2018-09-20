precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D uTexture;

void main(void) {
    gl_FragColor = texture2D(uTexture, vUv);
}