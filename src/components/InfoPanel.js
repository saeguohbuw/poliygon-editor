import { store } from "../state/store.js";

class InfoPanel extends HTMLElement {
  connectedCallback() {
    this.style.marginLeft = "auto";
    this.style.opacity = "0.8";

    store.subscribe(() => this.render());
    this.render();
  }

  render() {
    const selected = store.polygons.find(p => p.id === store.selectedId);

    this.innerHTML = `
      <span>Polygons: ${store.polygons.length}</span>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <span>${selected ? "Selected: " + selected.id.slice(0, 6) : "Nothing selected"}</span>
    `;
  }
}

customElements.define("info-panel", InfoPanel);