import { history } from "../history/history.js";

export const store = {
  polygons: [],
  selectedId: null,
  listeners: [],

  setState(newState) {
    Object.assign(this, newState);
    this.notify();
  },

  apply(action) {
    const newState = action.redo(this);
    this.setState(newState);
    history.push(action);
  },

  undo() {
    const newState = history.undo(this);
    this.setState(newState);
  },

  redo() {
    const newState = history.redo(this);
    this.setState(newState);
  },

  subscribe(fn) {
    this.listeners.push(fn);
  },

  notify() {
    this.listeners.forEach((fn) => fn(this));
  },
};
