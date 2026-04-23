export function clampMove(points, dx, dy, width, height) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  points.forEach(p => {
    const x = p.x + dx;
    const y = p.y + dy;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  if (minX < 0) dx -= minX;
  if (maxX > width) dx -= (maxX - width);

  if (minY < 0) dy -= minY;
  if (maxY > height) dy -= (maxY - height);

  return { dx, dy };
}