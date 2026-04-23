export function createPolygon(cx, cy, radius, count) {
  const points = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;

    let randomFactor = 0.6 + Math.random() * 0.8;

    if (Math.random() < 0.3) {
      randomFactor *= 0.4;
    }

    points.push({
      x: cx + Math.cos(angle) * radius * randomFactor,
      y: cy + Math.sin(angle) * radius * randomFactor,
    });
  }

  return points;
}
