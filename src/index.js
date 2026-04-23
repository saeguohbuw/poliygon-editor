import "./app/AppRoot.js";
import "./components/ToolbarPanel.js";
import "./components/CanvasView.js";
import "./components/InfoPanel.js";
import { store } from "./state/store.js";

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (e.ctrlKey && e.key === "z") {
    e.preventDefault();
    store.undo();
  }

  if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
    e.preventDefault();
    store.redo();
  }
});
