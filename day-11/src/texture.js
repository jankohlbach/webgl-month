import vShaderSource from './shaders/texture.v.glsl';
import fShaderSource from './shaders/texture.f.glsl';
import { compileShader, createTexture, loadImage, setImage, setupShaderInput } from './gl-helpers';
import { createRect } from './shape-helpers';
import { GLBuffer } from './GLBuffer';

import textureImageSrc from './assets/images/texture.jpg';
import textureGreenImageSrc from './assets/images/texture-green.jpg';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const vShader = gl.createShader(gl.VERTEX_SHADER);
const fShader = gl.createShader(gl.FRAGMENT_SHADER);

compileShader(gl, vShader, vShaderSource);
compileShader(gl, fShader, fShaderSource);

const program = gl.createProgram();

gl.attachShader(program, vShader);
gl.attachShader(program, fShader);

gl.linkProgram(program);

gl.useProgram(program);

const texCoordsBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
  ...createRect(0, 0, 1, 1),
  ...createRect(0, 0, 1, 1),
  ]),
  gl.STATIC_DRAW,
);

const texIndiciesBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
  ...Array.from({length: 4}).fill(0),
  ...Array.from({length: 4}).fill(1),
  ]),
  gl.STATIC_DRAW,
);

const vertexPosition = new GLBuffer(gl, gl.ARRAY_BUFFER, new Float32Array([
  ...createRect(-1, -1, 1, 2),
  ...createRect(-1, 0, 1, 2),
  ]),
  gl.STATIC_DRAW,
);

const programInfo = setupShaderInput(gl, program, vShaderSource, fShaderSource);

vertexPosition.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.position, 2, gl.FLOAT, false, 0, 0);

texCoordsBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.texCoord, 2, gl.FLOAT, false, 0, 0);

texIndiciesBuffer.bind(gl);
gl.vertexAttribPointer(programInfo.attributeLocations.texIndex, 1, gl.FLOAT, false, 0, 0);

const indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
  0, 1, 2,
  1, 2, 3,
  4, 5, 6,
  5, 6, 7,
  ]),
  gl.STATIC_DRAW,
);

Promise.all([
  loadImage(textureImageSrc),
  loadImage(textureGreenImageSrc),
])
  .then(([textureImage, textureGreenImageSrc]) => {
    const texture = createTexture(gl);
    setImage(gl, texture, textureImage);

    const otherTexture = createTexture(gl);
    setImage(gl, otherTexture, textureGreenImageSrc);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.texture, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, otherTexture);
    gl.uniform1i(programInfo.uniformLocations.otherTexture, 1);

    gl.uniform2fv(programInfo.uniformLocations.resolution, [canvas.width, canvas.height]);

    gl.drawElements(gl.TRIANGLES, indexBuffer.data.length, gl.UNSIGNED_BYTE, 0);
  });
