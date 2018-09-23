const nanogl = require('nanogl');
const mat4 = require('gl-mat4');

import json from './duck.json';
import frag from './default.frag';
import vert from './default.vert';

import waterVert from './plane.vert';
import waterFrag from './plane.frag';

import Plane from './plane';

const canvas = document.querySelector('.canvas');

const gl = canvas.getContext('webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.enable(gl.DEPTH_TEST);
// gl.enable(gl.CULL_FACE);
// gl.cullFace(gl.BACK);
gl.viewport(0, 0, canvas.width, canvas.height);

const shader = new nanogl.Program(gl, vert, frag);
const watershader = new nanogl.Program(gl, waterVert, waterFrag);

const p = mat4.create();
let m = mat4.create();
const waterPos = mat4.create();

mat4.perspective(p, 45, canvas.width / canvas.height, 1, 100);
mat4.rotateX(p, p, 0.56);
mat4.translate(p, p, [0, -2.5, -2]);
mat4.translate(waterPos, waterPos, [0, -1.25, -5]);
mat4.scale(waterPos, waterPos, [1, 1, 1]);

const model = createModel(json, gl);
const plane = new Plane(gl, 255, 25, 25);
let i = 0;
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

function drawGridDuckies() {
    for (let x = -2; x < 3; x++) {
        for (let y = -2; y < 3; y++) {
            m = mat4.create();
            shader.uPosition([x * 1.5, 0, y * 1.5]);
            mat4.translate(m, m, [x * 1.5, -1.65, -5 + y * 1.5]);
            mat4.scale(m, m, [0.5, 0.5, 0.5]);
            shader.uModel(m);
            model.draw(shader);
        }
    }
}

function drawCircleDuckies() {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            m = mat4.create();
            let position = [Math.cos(i * 0.1 + ((x * 5 + y)/ 25) * Math.PI * 2) * 5, -1.65, -6 + Math.sin(i * 0.1 + ((x * 5 + y)/ 25) * Math.PI * 2) * 5];
            let nextPosition = [Math.cos(i * 0.1 + ((x * 5 + y+ 1)/ 25) * Math.PI * 2) * 5, -1.65, -6 + Math.sin(i * 0.1 + ((x * 5 + y+ 1)/ 25) * Math.PI * 2) * 5];

            mat4.translate(m, m, position);
            mat4.rotateY(m, m, -(Math.atan2(nextPosition[2] - position[2], nextPosition[0] - position[0])));
            mat4.scale(m, m, [0.5, 0.5, 0.5]);
            position[2] += 5;
            shader.uPosition(position);
            shader.uModel(m);
            model.draw(shader);
        }
    }
}


function draw() {
    i += 0.01;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // mat4.rotateY(m, m, 0.01);
    shader.bind();
    shader.uTime(i);
    shader.uMvp(p);
    shader.uZoom(1.2);
    shader.uOffset(plane.uOffset * 0.5);
    drawCircleDuckies();

    watershader.bind();
    watershader.uTime(i);
    watershader.uModel(waterPos);
    watershader.uMvp(p);
    watershader.uZoom(1.2);
    watershader.uOffset(plane.uOffset);
    plane.draw(watershader);
    // plane.drawWireFrame(watershader);
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