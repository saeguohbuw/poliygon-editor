export function addPolygonAction(polygon) {
  return {
    undo(state) {
      return {
        ...state,
        polygons: state.polygons.filter((p) => p.id !== polygon.id),
      };
    },
    redo(state) {
      return {
        ...state,
        polygons: [...state.polygons, polygon],
      };
    },
  };
}

export function movePolygonAction(id, from, to) {
  return {
    undo(state) {
      return {
        ...state,
        polygons: state.polygons.map((p) =>
          p.id === id ? { ...p, points: from } : p,
        ),
      };
    },
    redo(state) {
      return {
        ...state,
        polygons: state.polygons.map((p) =>
          p.id === id ? { ...p, points: to } : p,
        ),
      };
    },
  };
}

export function deletePolygonAction(polygon) {
  return {
    undo(state) {
      return {
        ...state,
        polygons: [...state.polygons, polygon],
      };
    },
    redo(state) {
      return {
        ...state,
        polygons: state.polygons.filter((p) => p.id !== polygon.id),
        selectedId: null,
      };
    },
  };
}
