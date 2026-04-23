import "./app/AppRoot.js";
import "./components/ToolbarPanel.js";
import "./components/CanvasView.js";
import "./components/InfoPanel.js";
import { deletePolygonAction } from "./history/actions.js";
import { store } from "./state/store.js";

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") {
    e.preventDefault();
    store.undo();
  }

  if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
    e.preventDefault();
    store.redo();
  }

  if (e.key === "Delete") {
    const id = store.selectedId;

    if (!id) {
      alert("Ничего не выбрано");
      return;
    }

    const polygon = store.polygons.find((p) => p.id === id);
    store.apply(deletePolygonAction(polygon));
  }
});
