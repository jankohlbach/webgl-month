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

  State.ext.vertexAttribDivisorANGLE(State.programInfo.attributeLocations.index, 0);
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

  State.indexBuffer.bind(gl);
  gl.vertexAttribPointer(State.programInfo.attributeLocations.index, 1, gl.FLOAT, false, 0, 0);
  State.ext.vertexAttribDivisorANGLE(State.programInfo.attributeLocations.index, 1);
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

  const indices = new Float32Array(100 * 100);

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

      indices[cubeIndex] = cubeIndex;

      cubeIndex += 1;
    }
  }

  State.matricesBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, matrices, gl.STATIC_DRAW);
  State.indexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  State.offset = 4 * 4;
  State.stride = State.offset * 4;

  State.ext = gl.getExtension('ANGLE_instanced_arrays');

  for (let i = 0; i < 4; i += 1) {
    gl.enableVertexAttribArray(State.programInfo.attributeLocations.modelMatrix + i);
  }

  await loadImage(textureSource)
    .then((image) => {
      const texture = createTexture(gl);
      State.texture = texture;

      setImage(gl, texture, image);

      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    });

  setupAttributes(gl);

  resetDivisorAngles();
}

export function render(gl, viewMatrix, projectionMatrix, renderIndices, selectedObjectIndex) {
  gl.useProgram(State.program);

  gl.bindTexture(gl.TEXTURE_2D, State.texture);

  gl.uniformMatrix4fv(State.programInfo.uniformLocations.viewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(State.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);

  gl.uniform1f(State.programInfo.uniformLocations.selectedObjectIndex, selectedObjectIndex);

  setupAttributes(gl);

  if (renderIndices) {
    gl.uniform1f(State.programInfo.uniformLocations.renderIndices, 1);
  } else {
    gl.uniform1f(State.programInfo.uniformLocations.renderIndices, 0);
  }

  State.ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, State.vertexBuffer.data.length / 3, 100 * 100);

  resetDivisorAngles();
}
