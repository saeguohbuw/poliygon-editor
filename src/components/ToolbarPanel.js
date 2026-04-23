import { store } from "../state/store.js";
import { createPolygon } from "../geometry/polygon.js";
import { addPolygonAction } from "../history/actions.js";
import { deletePolygonAction } from "../history/actions.js";
import { deleteAllAction } from "../history/actions.js";
import { hasCollision } from "../geometry/collision.js";
import { getBounds } from "../geometry/collision.js";

class ToolbarPanel extends HTMLElement {
  connectedCallback() {
    this.style.display = "flex";
    this.style.gap = "10px";
    this.style.padding = "10px";
    this.style.background = "#252525";

    this.innerHTML = `
      <button id="gen">➕ Generate</button>
      <button id="del">🗑 Delete</button>
      <button id="delAll">💣 Clear</button>
      <button id="undo">↶ Undo</button>
      <button id="redo">↷ Redo</button>
      <info-panel></info-panel>
    `;

    this.querySelector("#gen").onclick = () => this.generate();
    this.querySelector("#del").onclick = () => this.delete();
    this.querySelector("#delAll").onclick = () => this.deleteAll();
    this.querySelector("#undo").onclick = () => store.undo();
    this.querySelector("#redo").onclick = () => store.redo();
  }

  generate() {
    let polygon;
    let attempts = 0;

    const canvas = document.querySelector("canvas");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    do {
      const id = crypto.randomUUID();

      polygon = {
        id,
        points: createPolygon(
          Math.random() * canvasWidth,
          Math.random() * canvasHeight,
          40 + Math.random() * 30,
          Math.floor(Math.random() * 5) + 3,
        ),
        color: `hsl(${Math.random() * 360},70%,60%)`,
        createdAt: Date.now(),
      };

      const bounds = getBounds(polygon.points);

      const outOfBounds =
        bounds.minX < 0 ||
        bounds.maxX > canvasWidth ||
        bounds.minY < 0 ||
        bounds.maxY > canvasHeight;

      const collision = hasCollision(polygon, store.polygons);

      attempts++;

      if (!outOfBounds && !collision) {
        break;
      }
    } while (attempts < 30);

    if (attempts >= 30) {
      alert("Не удалось разместить полигон");
      return;
    }

    store.apply(addPolygonAction(polygon));
  }

  deleteSelected() {
    const id = store.selectedId;

    if (!id) {
      alert("Ничего не выбрано");
      return;
    }

    const polygon = store.polygons.find((p) => p.id === id);

    store.apply(deletePolygonAction(polygon));
  }

  deleteAll() {
    if (!confirm("Удалить все полигоны?")) return;
    if (store.polygons.length === 0) return;

    const snapshot = store.polygons.map((p) => ({
      ...p,
      points: p.points.map((pt) => ({ ...pt })),
    }));

    store.apply(deleteAllAction(snapshot));
  }
}

customElements.define("toolbar-panel", ToolbarPanel);
