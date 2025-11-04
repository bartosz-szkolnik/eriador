import { Entity, Trait, type GameContext } from '@eriador/core';

export class Velocity extends Trait {
  update(entity: Entity, { deltaTime }: GameContext): void {
    entity.position.x += entity.velocity.x * deltaTime;
    entity.position.y += entity.velocity.y * deltaTime;
  }
}
