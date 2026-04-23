import { store } from '../state/store.js';
import { isPointInPolygon } from '../geometry/hitTest.js';
import { Renderer } from '../canvas/Renderer.js';

class CanvasView extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<canvas width="1000" height="600"></canvas>`;
    this.canvas = this.querySelector('canvas');
    this.renderer = new Renderer(this.canvas);

    this.dragging = false;
    this.lastPos = null;

    this.bindEvents();

    store.subscribe(state => {
      this.renderer.draw(state.polygons, state.selectedId);
    });
  }

  bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMove(e));
    this.canvas.addEventListener('mouseup', () => this.onUp());
  }

  getMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  onDown(e) {
    const mouse = this.getMouse(e);

    let found = null;

    store.polygons.forEach(p => {
      if (isPointInPolygon(mouse, p.points)) {
        found = p.id;
      }
    });

    store.setState({ selectedId: found });

    if (found) {
      this.dragging = true;
      this.lastPos = mouse;
    }
  }

  onMove(e) {
    if (!this.dragging) return;

    const mouse = this.getMouse(e);
    const dx = mouse.x - this.lastPos.x;
    const dy = mouse.y - this.lastPos.y;

    store.update(state => {
      const poly = state.polygons.find(p => p.id === state.selectedId);
      if (!poly) return;

      poly.points.forEach(pt => {
        pt.x += dx;
        pt.y += dy;
      });
    });

    this.lastPos = mouse;
  }

  onUp() {
    this.dragging = false;
  }
}

customElements.define('canvas-view', CanvasView);