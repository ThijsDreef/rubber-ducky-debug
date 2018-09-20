const nanogl = require('nanogl');
const mat4 = require('gl-mat4');

import json from './duck.json';
import frag from './default.frag';
import vert from './default.vert';


const canvas = document.querySelector('.canvas');

const gl = canvas.getContext('webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.viewport(0, 0, canvas.width, canvas.height);

const shader = new nanogl.Program(gl, vert, frag);

const p = mat4.create();
const m = mat4.create();

mat4.perspective(p, 45, canvas.width / canvas.height, 1, 10);
mat4.translate(p, p, [0, -2, 0]);
mat4.rotateX(p, p, 0.5);
mat4.translate(m, m, [0, -2.5, -6]);

const model = createModel(json, gl);
draw();

const img = new Image();
img.src = 'duck.png';
img.onload = ()=> {
    shader.bind();
    const tex = new nanogl.Texture(gl);
    tex.fromImage(img);
    shader.uTexture(tex);
    requestAnimationFrame(draw);
}


function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.rotateY(m, m, 0.01);
    shader.bind();
    shader.uModel(m);
    shader.uMvp(p);
    model.draw(shader);
    requestAnimationFrame(draw);
}

function createModel(json, gl) {
    const object = {};
    object.vBuffer = new nanogl.ArrayBuffer(gl, new Float32Array(json.verts), gl.STATIC_DRAW);
    object.nBuffer = new nanogl.ArrayBuffer(gl, new Float32Array(json.normals), gl.STATIC_DRAW);
    object.uvBuffer = new nanogl.ArrayBuffer(gl, new Float32Array(json.texcoords), gl.STATIC_DRAW);
    object.vBuffer.attrib('aPosition', 3, gl.FLOAT);
    object.nBuffer.attrib('aNormal', 3, gl.FLOAT);
    object.uvBuffer.attrib('aUv', 2, gl.FLOAT);
    object.iBuffer = new nanogl.IndexBuffer(gl, gl.UNSIGNED_SHORT, new Uint16Array(json.indices), gl.STATIC_DRAW);
    object.draw = (shader)=>{
        shader.bind();
        object.vBuffer.bind();
        object.vBuffer.attribPointer(shader);
        object.nBuffer.bind();
        object.nBuffer.attribPointer(shader);
        object.uvBuffer.bind();
        object.uvBuffer.attribPointer(shader);
        object.iBuffer.bind();
        object.iBuffer.draw(gl.TRIANGLES);
    }
    return object;
}