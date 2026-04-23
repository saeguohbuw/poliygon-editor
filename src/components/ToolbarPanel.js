import { store } from "../state/store.js";
import { createPolygon } from "../geometry/polygon.js";
import { addPolygonAction } from "../history/actions.js";

class ToolbarPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="padding:10px; display:flex; gap:10px;">
        <button id="gen">Generate</button>
        <button id="undo">Undo</button>
        <button id="redo">Redo</button>
      </div>
    `;

    this.querySelector("#gen").onclick = () => this.generate();
    this.querySelector("#undo").onclick = () => store.undo();
    this.querySelector("#redo").onclick = () => store.redo();
  }

  generate() {
    const id = crypto.randomUUID();

    const polygon = {
      id,
      points: createPolygon(
        200 + Math.random() * 400,
        150 + Math.random() * 300,
        40 + Math.random() * 30,
        Math.floor(Math.random() * 5) + 3,
      ),
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };

    store.apply(addPolygonAction(polygon));
  }
}

customElements.define("toolbar-panel", ToolbarPanel);
