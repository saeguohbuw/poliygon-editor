import { store } from "../state/store.js";
import { hasCollision } from "../geometry/collision.js";
import { clampMove } from "../geometry/bounds.js";

class CanvasView extends HTMLElement {
  connectedCallback() {
    this.style.display = "block";
    this.style.flex = "1";
    this.style.minHeight = "0";

    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    this.canvas.style.cursor = "default";

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
    this.canvas.style.background = "#1a1a1a";

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
      this.pointInPolygon(mouse, p.points)
    );

    if (found) {
      store.selectedId = found.id;

      this.dragging = true;
      this.lastPos = mouse;

      this.dragStartPoints = found.points.map((p) => ({ ...p }));
      this.canvas.style.cursor = "grabbing";
    } else {
      store.selectedId = null;
    }

    store.notify();
  }

  onMove(e) {
    const mouse = this.getMouse(e);

    // 🔥 hover работает всегда
    const hovering = store.polygons.some((p) =>
      this.pointInPolygon(mouse, p.points)
    );

    if (!this.dragging) {
      this.canvas.style.cursor = hovering ? "grab" : "default";
      return;
    }

    let dx = mouse.x - this.lastPos.x;
    let dy = mouse.y - this.lastPos.y;

    const poly = store.polygons.find((p) => p.id === store.selectedId);
    if (!poly) return;

    const clamped = clampMove(
      poly.points,
      dx,
      dy,
      this.canvas.width,
      this.canvas.height
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
      store.apply(
        movePolygonAction(poly.id, this.dragStartPoints, endPoints)
      );
    });

    this.dragging = false;
    this.canvas.style.cursor = "default";
  }

  render() {
    if (!this.ctx) return;

    const now = Date.now();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    store.polygons.forEach((p) => {
      const duration = 300;
      const t = Math.min(1, (now - (p.createdAt || 0)) / duration);

      this.drawPolygonAnimated(p, t);
    });

    if (store.polygons.some((p) => now - (p.createdAt || 0) < 300)) {
      requestAnimationFrame(() => this.render());
    }
  }

  drawPolygonAnimated(polygon, t) {
    const ctx = this.ctx;

    const ease = t * (2 - t);

    const cx =
      polygon.points.reduce((sum, p) => sum + p.x, 0) / polygon.points.length;
    const cy =
      polygon.points.reduce((sum, p) => sum + p.y, 0) / polygon.points.length;

    ctx.save();

    ctx.globalAlpha = ease;

    ctx.translate(cx, cy);
    ctx.scale(ease, ease);
    ctx.translate(-cx, -cy);

    ctx.beginPath();

    polygon.points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });

    ctx.closePath();

    ctx.fillStyle = polygon.color;
    ctx.fill();

    ctx.lineWidth = polygon.id === store.selectedId ? 3 : 1;
    ctx.strokeStyle = polygon.id === store.selectedId ? "#ffffff" : "#333";
    ctx.stroke();

    ctx.restore();
  }

  pointInPolygon(point, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  }
}

customElements.define("canvas-view", CanvasView);