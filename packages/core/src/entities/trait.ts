import { type Side, type Entity } from './entity';
import type { GameContext } from '../types';
// import type { Match } from '../collisions/tile-resolver';

export type TraitCtor = new () => Trait;

export class Trait {
  update(_entity: Entity, _gameContext: GameContext) {
    console.warn('Unhandled update call in Trait');
  }

  // obstruct(_entity: Entity, _side: Side, _match: Match) {}
}
