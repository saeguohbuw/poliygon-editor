import { store } from "../state/store.js";

class InfoPanel extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div style="padding:10px"></div>`;
    this.el = this.querySelector("div");

    store.subscribe((state) => {
      this.el.textContent = `Polygons: ${state.polygons.length} | Selected: ${state.selectedId || "None"}`;
    });
  }
}

customElements.define("info-panel", InfoPanel);
