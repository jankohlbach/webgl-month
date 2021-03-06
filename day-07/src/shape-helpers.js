export function createRect(top, left, width, height) {
  return [
    left, top,
    left + width, top,
    left, top + height,
    left + width, top + height,
  ];
}

export function createHexagon(centerX, centerY, radius, segmentsCount) {
  const vertexData = [];
  const segmentAngle =  Math.PI * 2 / segmentsCount;

  for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
    const from = i;
    const to = i + segmentAngle;

    const color = rainbowColors[i / segmentAngle];

    vertexData.push(centerX, centerY);
    vertexData.push(...color);

    vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
    vertexData.push(...color);

    vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
    vertexData.push(...color);
  }

  return vertexData;
}
