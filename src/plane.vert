precision highp float;
attribute vec3 aPosition;
attribute vec2 aUv;

varying vec3 vNormal;
varying vec2 vUv;
varying float vHeight;

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
    h.x = bump(aPosition + uOffset * vec3( 0, 0, -1)); 
    h.y = bump(aPosition + uOffset * vec3(-1, 0, 0)); 
    h.z = bump(aPosition + uOffset * vec3( 1, 0, 0)); 
    h.w = bump(aPosition + uOffset * vec3( 0, 0, 1)); 
    vec3 n; 
    n.z = h.x - h.z; 
    n.x = h.y - h.w; 
    n.y = 2.; 
    return normalize(n); 
} 
void main()
{
    vUv = aUv;
    vNormal = filterNormal();
    vec3 e = vec3(uOffset, 0, 0);
    vNormal = normalize(vec3(bump(aPosition - e) - bump(aPosition + e), 2.0 * e.x, bump(aPosition - e.zyx) - bump(aPosition + e.zyx)));
    vHeight = (bump(aPosition)) * 0.5;
    
    gl_Position = uMvp * uModel * vec4(vec3(aPosition.x, bump(aPosition), aPosition.z), 1.);
}
 