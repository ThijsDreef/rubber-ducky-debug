precision mediump float;
attribute vec3 aPosition;
attribute vec2 aUv;
attribute vec3 aNormal;

varying vec3 vNormal;
varying vec2 vUv;

uniform mat4 uMvp;
uniform mat4 uModel;

void main()
{
    vUv = aUv;
    vNormal = (uModel * vec4(aNormal, 0)).xyz;
    gl_Position = uMvp * uModel * vec4(aPosition, 1);
}
