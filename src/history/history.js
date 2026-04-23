export class History {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  push(action) {
    this.undoStack.push(action);
    this.redoStack = [];
  }

  undo(state) {
    const action = this.undoStack.pop();
    if (!action) return state;

    this.redoStack.push(action);
    return action.undo(state);
  }

  redo(state) {
    const action = this.redoStack.pop();
    if (!action) return state;

    this.undoStack.push(action);
    return action.redo(state);
  }
}

export const history = new History();
