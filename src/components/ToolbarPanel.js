import { store } from "../state/store.js";
import { createPolygon } from "../geometry/polygon.js";
import { addPolygonAction } from "../history/actions.js";
import { deletePolygonAction } from "../history/actions.js";
import { deleteAllAction } from "../history/actions.js";
import { hasCollision } from "../geometry/collision.js";

class ToolbarPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="padding:10px; display:flex; gap:10px;">
      <button id="gen">Generate</button>
      <button id="delete">Delete</button>
      <button id="deleteAll">Delete All</button>
      <button id="undo">Undo</button>
      <button id="redo">Redo</button>
    </div>
`;

    this.querySelector("#gen").onclick = () => this.generate();
    this.querySelector("#delete").onclick = () => this.deleteSelected();
    this.querySelector("#deleteAll").onclick = () => this.deleteAll();
    this.querySelector("#undo").onclick = () => store.undo();
    this.querySelector("#redo").onclick = () => store.redo();
  }

  generate() {
    let polygon;
    let attempts = 0;

    do {
      const id = crypto.randomUUID();

      polygon = {
        id,
        points: createPolygon(
          200 + Math.random() * 400,
          150 + Math.random() * 300,
          40 + Math.random() * 30,
          Math.floor(Math.random() * 5) + 3,
        ),
        color: `hsl(${Math.random() * 360},70%,60%)`,
      };

      attempts++;
    } while (hasCollision(polygon, store.polygons) && attempts < 20);

    if (attempts >= 20) {
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
