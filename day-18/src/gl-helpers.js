import extract from 'glsl-extract-sync';

export function compileShader(gl, shader, source) {
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const log = gl.getShaderInfoLog(shader);

  if (log) {
    throw new Error(log);
  }
}

export function setupShaderInput(gl, program, vShaderSource, fShaderSource) {
  const vShaderInfo = extract(vShaderSource);
  const fShaderInfo = extract(fShaderSource);

  const attributes = vShaderInfo.attributes;
  const uniforms = [
    ...vShaderInfo.uniforms,
    ...fShaderInfo.uniforms,
  ];

  const attributeLocations = attributes.reduce((attrsMap, attr) => {
    attrsMap[attr.name] = gl.getAttribLocation(program, attr.name);
    return attrsMap;
  }, {});

  attributes.forEach((attr) => {
    gl.enableVertexAttribArray(attributeLocations[attr.name]);
  });

  const uniformLocations = uniforms.reduce((uniformsMap, uniform) => {
    uniformsMap[uniform.name] = gl.getUniformLocation(program, uniform.name);
    return uniformsMap;
  }, {});

  return {
    attributeLocations,
    uniformLocations,
  };
}

export function parseVec(string, prefix) {
  return string.replace(prefix, '').split(' ').map(Number);
}

export function parseFace(string) {
  return string.replace('f ', '').split(' ').map((chunk) => {
    return chunk.split('/').map(Number);
  });
}

export function parseObj(objSource) {
  const _vertices = [];
  const _normals = [];
  const vertexIndices = [];
  const normalIndices = [];

  objSource.split('\n').forEach((line) => {
    if (line.startsWith('v ')) {
      _vertices.push(parseVec(line, 'v '));
    }

    if (line.startsWith('vn ')) {
      _normals.push(parseVec(line, 'vn '))
    }

    if (line.startsWith('f ')) {
      const parsedFace = parseFace(line);

      vertexIndices.push(...parsedFace.map((face) => face[0] - 1));
      normalIndices.push(...parsedFace.map((face) => face[2] - 1));
    }
  });

  const vertices = [];
  const normals = [];

  for (let i = 0; i < vertexIndices.length; i += 1) {
    const vertexIndex = vertexIndices[i];
    const normalIndex = normalIndices[i];

    const vertex = _vertices[vertexIndex];
    const normal = _normals[normalIndex];

    vertices.push(...vertex);
    normals.push(...normal);
  }

  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
  };
}

export async function loadImage(src) {
  const img = new Image();

  let _resolve;
  const p = new Promise((resolve) => _resolve = resolve);

  img.onload = () => {
    _resolve(img);
  }

  img.src = src;

  return p;
}

export function createTexture(gl) {
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return texture;
}

export function setImage(gl, texture, img) {
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    img,
  );
}
