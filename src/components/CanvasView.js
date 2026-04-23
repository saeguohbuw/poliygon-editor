import { store } from "../state/store.js";
import { hasCollision } from "../geometry/collision.js";
import { clampMove } from "../geometry/bounds.js";

class CanvasView extends HTMLElement {
  connectedCallback() {
    this.style.display = "block";
    this.style.flex = "1";

    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";

    this.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    this.dragging = false;
    this.lastPos = null;
    this.dragStartPoints = null;

    requestAnimationFrame(() => this.resize());
    window.addEventListener("resize", () => this.resize());

    this.initEvents();

    store.subscribe(() => this.render());
  }

  resize() {
    this.canvas.width = this.clientWidth;
    this.canvas.height = this.clientHeight;

    this.render();
  }

  initEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.onDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMove(e));
    window.addEventListener("mouseup", () => this.onUp());
  }

  getMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  onDown(e) {
    const mouse = this.getMouse(e);

    const found = store.polygons.find((p) =>
      this.pointInPolygon(mouse, p.points),
    );

    if (found) {
      store.selectedId = found.id;

      this.dragging = true;
      this.lastPos = mouse;

      this.dragStartPoints = found.points.map((p) => ({ ...p }));
    } else {
      store.selectedId = null;
    }

    store.notify();
  }

  onMove(e) {
    if (!this.dragging) return;

    const mouse = this.getMouse(e);

    let dx = mouse.x - this.lastPos.x;
    let dy = mouse.y - this.lastPos.y;

    const poly = store.polygons.find((p) => p.id === store.selectedId);
    if (!poly) return;

    const clamped = clampMove(
      poly.points,
      dx,
      dy,
      this.canvas.width,
      this.canvas.height,
    );

    dx = clamped.dx;
    dy = clamped.dy;

    const moved = {
      ...poly,
      points: poly.points.map((pt) => ({
        x: pt.x + dx,
        y: pt.y + dy,
      })),
    };

    const others = store.polygons.filter((p) => p.id !== poly.id);

    if (hasCollision(moved, others)) return;

    poly.points = moved.points;

    this.lastPos = mouse;
    store.notify();
  }

  onUp() {
    if (!this.dragging) return;

    const poly = store.polygons.find((p) => p.id === store.selectedId);
    if (!poly) return;

    const endPoints = poly.points.map((p) => ({ ...p }));

    import("../history/actions.js").then(({ movePolygonAction }) => {
      store.apply(movePolygonAction(poly.id, this.dragStartPoints, endPoints));
    });

    this.dragging = false;
  }

  render() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    store.polygons.forEach((p) => this.drawPolygon(p));
  }

  drawPolygon(polygon) {
    const ctx = this.ctx;

    ctx.beginPath();

    polygon.points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });

    ctx.closePath();

    ctx.fillStyle = polygon.color;
    ctx.fill();

    ctx.lineWidth = polygon.id === store.selectedId ? 3 : 1;
    ctx.strokeStyle = polygon.id === store.selectedId ? "#000" : "#333";
    ctx.stroke();
  }

  pointInPolygon(point, polygon) {
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
}

customElements.define("canvas-view", CanvasView);
