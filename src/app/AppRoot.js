class AppRoot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <toolbar-panel></toolbar-panel>
      <canvas-view style="flex:1;"></canvas-view>
    `;
  }
}

customElements.define('app-root', AppRoot);