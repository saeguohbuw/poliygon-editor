export class History {
  constructor() {
    this.undo = [];
    this.redo = [];
  }

  push(action) {
    this.undo.push(action);
    this.redo = [];
  }

  undoAction() {
    return this.undo.pop();
  }

  redoAction() {
    return this.redo.pop();
  }
}