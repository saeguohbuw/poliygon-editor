import { store } from '../state/store.js';
import { createPolygon } from '../geometry/polygon.js';

class ToolbarPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="padding:10px; display:flex; gap:10px;">
        <button id="gen">Generate</button>
      </div>
    `;

    this.querySelector('#gen').onclick = () => this.generate();
  }

  generate() {
    const id = crypto.randomUUID();

    const poly = {
      id,
      points: createPolygon(
        200 + Math.random() * 500,
        150 + Math.random() * 300,
        40 + Math.random() * 30,
        Math.floor(Math.random() * 5) + 3
      ),
      color: `hsl(${Math.random() * 360},70%,60%)`
    };

    store.setState({
      polygons: [...store.polygons, poly]
    });
  }
}

customElements.define('toolbar-panel', ToolbarPanel);