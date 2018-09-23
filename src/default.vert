precision highp float;
attribute vec3 aPosition;
attribute vec2 aUv;
attribute vec3 aNormal;

varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 uPosition;

uniform float uOffset;
uniform float uTime;
uniform float uZoom;

uniform mat4 uMvp;
uniform mat4 uModel;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

mat3 rotateZ(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
}

mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
    );
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float bump(vec3 pos) {
    return noise((pos.xz + uTime) / uZoom) * noise((pos.xz - uTime) / uZoom);
}
vec3 filterNormal() 
{ 
    vec4 h; 
    h.x = bump(uPosition + uOffset * vec3( 0, 0, -1)); 
    h.y = bump(uPosition + uOffset * vec3(-1, 0, 0)); 
    h.z = bump(uPosition + uOffset * vec3( 1, 0, 0)); 
    h.w = bump(uPosition + uOffset * vec3( 0, 0, 1)); 
    vec3 n; 
    n.z = h.x - h.z; 
    n.x = h.y - h.w; 
    n.y = 0.5; 
    return normalize(n); 
} 

void main()
{
    vUv = aUv;
    float y = bump(uPosition) * 1.5;
    vec3 normal = filterNormal();
    // vec3 pos = aPosition * 
    mat3 waveRotation = rotateX(normal.x) * rotateZ(normal.z);
    // waveRotation = mat3(vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1));
    vNormal = normalize((mat3(uModel) * waveRotation * aNormal).xyz);
    gl_Position = uMvp * uModel * vec4(waveRotation * (aPosition + vec3(0, y, 0)), 1);
}
