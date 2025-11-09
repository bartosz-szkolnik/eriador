import { deserializeState, type SerializedState } from './state';
import type { TetrisRendererPair } from './tetris-builder';

export class TetrisManager {
  private readonly instances = new Map<string, TetrisRendererPair>();

  constructor(private readonly document: Document) {}

  get games() {
    return this.instances;
  }

  addInstance(id: string, instance: TetrisRendererPair) {
    this.instances.set(id, instance);
  }

  removeInstance(id: string, instance: TetrisRendererPair) {
    this.instances.delete(id);
    this.document.body.removeChild(instance.tetris.parentElement);
  }

  updateInstance(id: string, state: SerializedState) {
    const game = this.instances.get(id);
    if (!game) {
      console.error(`Could not find a tetris instance with id ${id}`);
      return;
    }

    const deserialized = deserializeState(state);
    game.tetris.setState(deserialized);
    game.tetris.render(game.renderer);
  }

  includes(id: string) {
    return this.instances.has(id);
  }
}
