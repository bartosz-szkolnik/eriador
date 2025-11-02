import './style.css';
import { Timer } from '@beholder/core';
import { initializeCanvas, loadJSON, Keys, Compositor } from '@beholder/common';
import type { LevelSpec } from './types';
import { loadBackgroundSprites } from './sprites';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { createHero } from './entities';
import { setupKeyboard } from './input';

const { context } = initializeCanvas({ elementId: 'screen', width: 640, height: 640 });

const GRAVITY = 2000;

Promise.all([createHero(), loadBackgroundSprites(), loadLevel('debug')]).then(([hero, backgroundSprites, level]) => {
  const compositor = new Compositor();

  const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
  compositor.addLayer(backgroundLayer);

  hero.position.set(64, 180);

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(hero);

  const spriteLayer = createSpriteLayer(hero);
  compositor.addLayer(spriteLayer);

  const timer = new Timer();
  timer.setUpdateFn(deltaTime => {
    hero.update({ deltaTime });

    compositor.draw(context);

    hero.velocity.y += GRAVITY * deltaTime;
  });

  timer.start();

  window.addEventListener('keydown', e => {
    if (e.code === Keys.KEY_ESCAPE) {
      timer.stop();
      console.log('Timer stopped');
    }
  });
});

function loadLevel(name: string) {
  return loadJSON<LevelSpec>(`/assets/levels/${name}.json`);
}
