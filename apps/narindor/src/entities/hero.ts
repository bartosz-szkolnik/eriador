import { Entity } from '@eriador/core';
import { loadHeroSprite } from '../sprites';
import { Jump, Go } from '../traits';

export async function createHero() {
  const sprite = await loadHeroSprite();

  const hero = new Entity();
  hero.size.set(16, 16);

  hero.addTrait(new Go());
  hero.addTrait(new Jump());

  hero.draw = function drawHero(context) {
    sprite.draw('idle', context, 0, 0);
  };

  return hero;
}
