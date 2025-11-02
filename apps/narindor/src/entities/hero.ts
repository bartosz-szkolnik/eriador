import { Entity } from '@beholder/core';
import { loadHeroSprite } from '../sprites';
import { Jump, Velocity } from '../traits';

export async function createHero() {
  const sprite = await loadHeroSprite();

  const hero = new Entity();

  hero.addTrait(new Velocity());
  hero.addTrait(new Jump());

  hero.draw = function drawHero(context) {
    sprite.draw('idle', context, this.position.x, this.position.y);
  };

  return hero;
}
