import { mat4 } from 'gl-matrix';

import vShaderSource from './shaders/3d-textured.v.glsl';
import fShaderSource from './shaders/3d-textured.f.glsl';
import { compileShader, setupShaderInput, loadImage, setImage, createTexture } from './gl-helpers';
import { Object3D } from './Object3D';
import { GLBuffer } from './GLBuffer';
import cubeObj from './assets/objects/textured-cube.obj';
import textureSource from './assets/images/cube-texture.png';

const State = {};

function resetDivisorAngles() {
  for (let i = 0; i < 4; i += 1) {
    State.ext.vertexAttribDivisorANGLE(State.programInfo.attributeLocations.modelMatrix + i, 0);
  }
}

function setupAttributes(gl) {
  State.vertexBuffer.bind(gl);
  gl.vertexAttribPointer(State.programInfo.attributeLocations.position, 3, gl.FLOAT, false, 0, 0);

  State.texCoordsBuffer.bind(gl);
  gl.vertexAttribPointer(State.programInfo.attributeLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

  State.matricesBuffer.bind(gl);

  for (let i = 0; i < 4; i += 1) {
    gl.vertexAttribPointer(State.programInfo.attributeLocations.modelMatrix + i, 4, gl.FLOAT, false, State.stride, i * State.offset);
    State.ext.vertexAttribDivisorANGLE(State.programInfo.attributeLocations.modelMatrix + i, 1);
  }
}

export async function prepare(gl) {
  const vShader = gl.createShader(gl.VERTEX_SHADER);
  const fShader = gl.createShader(gl.FRAGMENT_SHADER);

  compileShader(gl, vShader, vShaderSource);
  compileShader(gl, fShader, fShaderSource);

  const program = gl.createProgram();
  State.program = program;

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);

  State.programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

  const cube = new Object3D(cubeObj, [0, 0, 0], [1, 0, 0]);

  State.vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);
  State.texCoordsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, cube.texCoords, gl.STATIC_DRAW);

  const matrices = new Float32Array(100 * 100 * 4 * 4);

  State.modelMatrix = mat4.create();
  State.rotationMatrix = mat4.create();

  let cubeIndex = 0;

  for (let i = -50; i < 50; i += 1) {
    for (let j = -50; j < 50; j += 1) {
      const position = [i * 2, (Math.floor(Math.random() * 2) - 1) * 2, j * 2];
      mat4.fromTranslation(State.modelMatrix, position);

      mat4.fromRotation(State.rotationMatrix, Math.PI * Math.round(Math.random() * 4), [0, 1, 0]);
      mat4.multiply(State.modelMatrix, State.modelMatrix, State.rotationMatrix);

      State.modelMatrix.forEach((value, index) => {
        matrices[cubeIndex * 4 * 4 + index] = value;
      });

      cubeIndex += 1;
    }
  }

  State.matricesBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, matrices, gl.STATIC_DRAW);

  State.offset = 4 * 4;
  State.stride = State.offset * 4;

  State.ext = gl.getExtension('ANGLE_instanced_arrays');

  for (let i = 0; i < 4; i += 1) {
    gl.enableVertexAttribArray(State.programInfo.attributeLocations.modelMatrix + i);
  }

  await loadImage(textureSource)
    .then((image) => {
      const texture = createTexture(gl);
      setImage(gl, texture, image);
    });

  setupAttributes(gl);
  resetDivisorAngles();
}

export function render(gl, viewMatrix, projectionMatrix) {
  gl.useProgram(State.program);

  gl.uniformMatrix4fv(State.programInfo.uniformLocations.viewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(State.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

  setupAttributes(gl);

  State.ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, State.vertexBuffer.data.length / 3, 100 * 100);

  resetDivisorAngles();
}
