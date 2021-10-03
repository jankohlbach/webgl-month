const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

const vShaderSrc = `
  attribute vec2 position;
  attribute vec4 color;
  uniform vec2 resolution;

  varying vec4 vColor;

  #define M_PI 3.1415926535897932384626433832795

  void main() {
    vec2 transformedPosition = position / resolution * 2.0 - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(transformedPosition, 0, 1);

    vColor = color;
  }
`;

const fShaderSrc = `
  precision mediump float;

  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor / 255.0;
    gl_FragColor.a = 1.0;
  }
`;

function compileShader(shader, source) {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const log = gl.getShaderInfoLog(shader);

  if (log) {
    throw new Error(log);
  }
}

compileShader(vertexShader, vShaderSrc);
compileShader(fragmentShader, fShaderSrc);

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

gl.useProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
const colorLocation = gl.getAttribLocation(program, 'color');

const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');

gl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);

const rainbow = [
  [255, 0, 0, 255],
  [255, 165, 0, 255],
  [255, 255, 0, 255],
  [0, 128, 0, 255],
  [0, 0, 255, 255],
  [75, 0, 130, 255],
  [238, 130, 238, 255],
];

function createRect(top, left, width, height) {
  return [
    left, top,
    left + width, top,
    left, top + height,
    left + width, top + height,
  ];
}

function createHexagon(centerX, centerY, radius, segmentsCount) {
  const vertexData = [];
  const segmentAngle = Math.PI * 2  / segmentsCount;

  for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
    const from = i;
    const to = i + segmentAngle;

    const color = rainbow[i / segmentAngle];

    vertexData.push(centerX, centerY);
    // vertexData.push(...color);

    vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
    // vertexData.push(...color);

    vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
    // vertexData.push(...color);
  }

  return vertexData;
}

function fillWithColors(segmentsCount) {
  const colors = [];

  for (let i = 0; i < segmentsCount; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      colors.push(...rainbow[i]);
    }
  }

  return colors;
}

// const triangles = createRect(0, 0, canvas.height, canvas.height);
const segments = 7;
const triangles = createHexagon(canvas.width / 2, canvas.height / 2, canvas.height / 2, segments);

const vertexData = new Float32Array(triangles);
const vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

const indexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);

// const indexData = new Uint8Array([
//   0, 1, 2,
//   0, 2, 5,
//   0, 5, 8,
//   0, 8, 11,
//   0, 11, 14,
//   0, 14, 17,
//   0, 17, 20,
// ]);
const indices = [];
for (let i = 0; i < segments; i += 1) {
  indices.push(
    0,
    i == 0 ? 1 : i * 3 - 1,
    (i + 1) * 3 - 1,
  );
}
const indexData = new Uint8Array(indices);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const attributeSize = 2;
const type = gl.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, attributeSize, type, normalized, stride, offset);

// gl.enableVertexAttribArray(colorLocation);
// gl.vertexAttribPointer(colorLocation, 4, type, normalized, stride, 8);

gl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);
