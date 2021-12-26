import { mat4, vec3 } from 'gl-matrix';

import vShaderSource from './shaders/skybox.v.glsl';
import fShaderSource from './shaders/skybox.f.glsl';
import { compileShader, setupShaderInput, loadImage } from './gl-helpers';
import { Object3D } from './Object3D';
import { GLBuffer } from './GLBuffer';
import cubeObj from './assets/objects/textured-cube.obj';

import rightTexture from './assets/images/skybox/right.jpg';
import leftTexture from './assets/images/skybox/left.jpg';
import upTexture from './assets/images/skybox/up.jpg';
import downTexture from './assets/images/skybox/down.jpg';
import backTexture from './assets/images/skybox/back.jpg';
import frontTexture from './assets/images/skybox/front.jpg';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const width = document.body.offsetWidth;
const height = document.body.offsetHeight;

canvas.width = width * devicePixelRatio;
canvas.height = height * devicePixelRatio;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

const vShader = gl.createShader(gl.VERTEX_SHADER);
const fShader = gl.createShader(gl.FRAGMENT_SHADER);

compileShader(gl, vShader, vShaderSource);
compileShader(gl, fShader, fShaderSource);

const program = gl.createProgram();

gl.attachShader(program, vShader);
gl.attachShader(program, fShader);

gl.linkProgram(program);
gl.useProgram(program);

const programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

const cube = new Object3D(cubeObj, [0, 0, 0], [0, 0, 0]);
const vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);

vertexBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.lookAt(
  viewMatrix,
  [0, 0, 0],
  [0, 0, -1],
  [0, 1, 0],
);

mat4.perspective(
  projectionMatrix,
  Math.PI / 360 * 90,
  canvas.width / canvas.height,
  0.01,
  100,
);

gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);
gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

gl.viewport(0, 0, canvas.width, canvas.height);

const cameraPosition = [0, 0, 0];
const cameraFocusPoint = vec3.fromValues(0, 0, 1);
const cameraFocusPointMatrix = mat4.create();

mat4.fromTranslation(cameraFocusPointMatrix, cameraFocusPoint);

function frame() {
  mat4.translate(cameraFocusPointMatrix, cameraFocusPointMatrix, [0, 0, -1]);
  mat4.rotateY(cameraFocusPointMatrix, cameraFocusPointMatrix, Math.PI / 360);
  mat4.translate(cameraFocusPointMatrix, cameraFocusPointMatrix, [0, 0, 1]);

  mat4.getTranslation(cameraFocusPoint, cameraFocusPointMatrix);

  mat4.lookAt(
    viewMatrix,
    cameraPosition,
    cameraFocusPoint,
    [0, 1, 0],
  );

  gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, viewMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.data.length / 3);

  requestAnimationFrame(frame);
}

Promise.all([
  loadImage(rightTexture),
  loadImage(leftTexture),
  loadImage(upTexture),
  loadImage(downTexture),
  loadImage(backTexture),
  loadImage(frontTexture),
])
  .then((images) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    images.forEach((image, index) => {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    });

    frame();
  });
