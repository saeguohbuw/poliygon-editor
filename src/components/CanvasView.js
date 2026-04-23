import { store } from "../state/store.js";
import { isPointInPolygon } from "../geometry/hitTest.js";
import { Renderer } from "../canvas/Renderer.js";
import { movePolygonAction } from "../history/actions.js";
import { hasCollision } from "../geometry/collision.js";

class CanvasView extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<canvas width="1000" height="600"></canvas>`;
    this.canvas = this.querySelector("canvas");
    this.renderer = new Renderer(this.canvas);

    this.dragging = false;
    this.lastPos = null;
    this.dragStartPoints = null;

    this.bindEvents();

    store.subscribe((state) => {
      this.renderer.draw(state.polygons, state.selectedId);
    });
  }

  bindEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.onDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMove(e));
    this.canvas.addEventListener("mouseup", () => this.onUp());
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

    let found = null;

    store.polygons.forEach((p) => {
      if (isPointInPolygon(mouse, p.points)) {
        found = p.id;
      }
    });

    store.setState({ selectedId: found });

    if (found) {
      this.dragging = true;
      this.lastPos = mouse;

      const poly = store.polygons.find((p) => p.id === found);
      this.dragStartPoints = poly.points.map((p) => ({ ...p }));
    }
  }

  onMove(e) {
    if (!this.dragging) return;

    const mouse = this.getMouse(e);

    const dx = mouse.x - this.lastPos.x;
    const dy = mouse.y - this.lastPos.y;

    const poly = store.polygons.find((p) => p.id === store.selectedId);
    if (!poly) return;

    const moved = {
      ...poly,
      points: poly.points.map((pt) => ({
        x: pt.x + dx,
        y: pt.y + dy,
      })),
    };

    const others = store.polygons.filter((p) => p.id !== poly.id);

    if (hasCollision(moved, others)) {
      return;
    }

    poly.points = moved.points;

    this.lastPos = mouse;
    store.notify();
  }

  onUp() {
    if (!this.dragging) return;

    const poly = store.polygons.find((p) => p.id === store.selectedId);
    const endPoints = poly.points.map((p) => ({ ...p }));

    store.apply(movePolygonAction(poly.id, this.dragStartPoints, endPoints));

    this.dragging = false;
  }
}

customElements.define("canvas-view", CanvasView);
