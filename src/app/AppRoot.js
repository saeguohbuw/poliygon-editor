import { store } from '../state/store.js';

class AppRoot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <toolbar-panel></toolbar-panel>
      <canvas-view></canvas-view>
      <info-panel></info-panel>
    `;
  }
}

customElements.define('app-root', AppRoot);