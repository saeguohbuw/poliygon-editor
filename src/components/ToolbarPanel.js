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
    this.style.flexWrap = "wrap";

    this.innerHTML = `
      <button id="gen">➕ Generate</button>
      <button id="del">🗑 Delete</button>
      <button id="delAll">💣 Clear</button>
      <button id="undo">↶ Undo</button>
      <button id="redo">↷ Redo</button>
      <button id="export">💾 Export</button>
      <button id="import">📂 Import</button>
      <input type="file" id="fileInput" style="display:none" />
      <info-panel></info-panel>
    `;

    this.querySelector("#gen").onclick = () => this.generate();
    this.querySelector("#del").onclick = () => this.deleteSelected();
    this.querySelector("#delAll").onclick = () => this.deleteAll();
    this.querySelector("#undo").onclick = () => store.undo();
    this.querySelector("#redo").onclick = () => store.redo();
    this.querySelector("#export").onclick = () => this.exportJSON();
    this.querySelector("#import").onclick = () => this.importJSON();
    this.querySelector("#fileInput").onchange = (e) => this.handleFile(e);
  }

  exportJSON() {
    const data = JSON.stringify(store.polygons, null, 2);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "polygons.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  importJSON() {
    this.querySelector("#fileInput").click();
  }

  handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const polygons = JSON.parse(reader.result);

        const normalized = polygons.map((p) => ({
          ...p,
          createdAt: p.createdAt || Date.now(),
        }));

        import("../history/actions.js").then(
          ({ deleteAllAction, addPolygonAction }) => {
            store.apply(deleteAllAction(store.polygons));

            normalized.forEach((p) => {
              store.apply(addPolygonAction(p));
            });
          },
        );
      } catch {
        alert("Invalid JSON");
      }
    };

    reader.readAsText(file);
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
