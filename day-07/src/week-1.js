import vShaderSource from './shaders/vertex.glsl';
import fShaderSource from './shaders/fragment.glsl';

import { createRect } from './shape-helpers';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

function compileShader(shader, source) {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const log = gl.getShaderInfoLog(shader);

  if (log) {
    throw new Error(log);
  }
}

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

gl.useProgram(program);

const positionAttributeLocation = gl.getAttribLocation(program, 'position');

const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

const triangles = createRect(0, 0, canvas.height, canvas.height);

const vertexData = new Float32Array(triangles);
const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

const indexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

const indexData = new Uint8Array([
  0, 1, 2,
  1, 2, 3,
]);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const attributeSize = 2;
const type = gl.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, attributeSize, type, normalized, stride, offset);

gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);
