const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// ctx.fillRect(0, 0, 100, 50);

function calculatePixelIndices(top, left, width, height) {
  const pixelIndices = [];

  for (let x = left; x < left + width; x++) {
    for (let y = top; y < top + height; y++) {
      const i = y * canvas.width * 4 + x * 4;

      pixelIndices.push(i);
    }
  }

  return pixelIndices;
}

function fillRect(top, left, width, height, color = [0, 0, 0, 255]) {
  const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);

  const pixelIndices = calculatePixelIndices(top, left, width, height);

  pixelIndices.forEach((i) => {
    pixelStore[i] = color[0];  // r
    pixelStore[i + 1] = color[1];  // g
    pixelStore[i + 2] = color[2];  // b
    pixelStore[i + 3] = color[3];  // alpha
  });

  const imageData = new ImageData(pixelStore, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 0);
}

fillRect(10, 10, 100, 50, [0, 255, 0, 128]);
