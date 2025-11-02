import { Trait, type TraitCtor } from './trait';
import { Vector2 } from '../math';
import type { GameContext } from '../types';
// import type { Match } from '../collisions/tile-resolver';

export type Side = 'bottom' | 'top' | 'right' | 'left';

export class Entity {
  private readonly traits = new Map<TraitCtor, Trait>();

  readonly position = Vector2.from(0, 0);
  readonly velocity = Vector2.from(0, 0);
  readonly size = Vector2.from(0, 0);

  lifetime = 0;

  addTrait(trait: Trait) {
    this.traits.set(trait.constructor as TraitCtor, trait);
  }

  get<T extends Trait>(traitClass: new () => T) {
    const trait = this.traits.get(traitClass);
    if (!trait) {
      throw new Error(`Used trait ${traitClass.name} does not exist on Entity ${this.constructor.name}.`);
    }

    return trait as T;
  }

  has<T extends Trait>(traitClass: new () => T) {
    return this.traits.has(traitClass);
  }

  update(gameContext: GameContext) {
    this.traits.forEach(trait => {
      trait.update(this, gameContext);
    });

    this.lifetime += gameContext.deltaTime ?? 0;
  }

  // obstruct(side: Side, match: Match) {
  //   this.traits.forEach(trait => {
  //     trait.obstruct(this, side, match);
  //   });
  // }

  draw(_context: CanvasRenderingContext2D) {}
  turbo(_turboOn: boolean) {}
}
