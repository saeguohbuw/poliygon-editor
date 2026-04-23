export function getBounds(points) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

export function isIntersecting(a, b) {
  return !(
    a.maxX < b.minX ||
    a.minX > b.maxX ||
    a.maxY < b.minY ||
    a.minY > b.maxY
  );
}

function linesIntersect(a, b, c, d) {
  const det = (a, b, c, d) => a * d - b * c;

  const dx1 = b.x - a.x;
  const dy1 = b.y - a.y;
  const dx2 = d.x - c.x;
  const dy2 = d.y - c.y;

  const delta = det(dx1, dy1, dx2, dy2);
  if (delta === 0) return false;

  const s = det(c.x - a.x, c.y - a.y, dx2, dy2) / delta;
  const t = det(c.x - a.x, c.y - a.y, dx1, dy1) / delta;

  return s >= 0 && s <= 1 && t >= 0 && t <= 1;
}

export function polygonsIntersect(p1, p2) {
  for (let i = 0; i < p1.length; i++) {
    const a1 = p1[i];
    const a2 = p1[(i + 1) % p1.length];

    for (let j = 0; j < p2.length; j++) {
      const b1 = p2[j];
      const b2 = p2[(j + 1) % p2.length];

      if (linesIntersect(a1, a2, b1, b2)) {
        return true;
      }
    }
  }

  return false;
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export function hasCollision(newPoly, polygons) {
  const newBounds = getBounds(newPoly.points);

  return polygons.some((p) => {
    const b = getBounds(p.points);

    if (!isIntersecting(newBounds, b)) return false;

    if (polygonsIntersect(newPoly.points, p.points)) return true;

    if (pointInPolygon(newPoly.points[0], p.points)) return true;
    if (pointInPolygon(p.points[0], newPoly.points)) return true;

    return false;
  });
}
