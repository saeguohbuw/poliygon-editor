export const store = {
  polygons: [],
  selectedId: null,

  listeners: [],

  setState(partial) {
    Object.assign(this, partial);
    this.notify();
  },

  update(fn) {
    fn(this);
    this.notify();
  },

  subscribe(fn) {
    this.listeners.push(fn);
  },

  notify() {
    this.listeners.forEach(fn => fn(this));
  }
};