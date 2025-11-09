import { EventEmitter } from '@eriador/core';

export class StateManager<TState> {
  readonly events = new EventEmitter<'STATE_CHANGED'>();

  constructor(private state: TState) {}

  getState<Key extends keyof TState>(key: Key) {
    return this.state[key];
  }

  getAllState() {
    return { ...this.state };
  }

  modifyState = (value: Partial<TState>, options = { emitValue: true }) => {
    this.state = { ...this.state, ...value };
    if (options.emitValue) {
      this.events.emit('STATE_CHANGED', this.state);
    }
  };
}
