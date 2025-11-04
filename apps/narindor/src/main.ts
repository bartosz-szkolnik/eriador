import './style.css';
import { Timer, type GameContext } from '@beholder/core';
import { Camera, initializeCanvas, Keys, setupMouseControl } from '@beholder/common';
import { createHero } from './entities';
import { setupKeyboard } from './input';
import { loadRoom } from './loaders';
import { createCollisionLayer } from './layers';

const { context, canvas } = initializeCanvas({ elementId: 'screen', width: 640, height: 640 });

Promise.all([createHero(), loadRoom('debug')]).then(([hero, room]) => {
  const camera = new Camera();
  hero.position.set(64, 64);
  room.addEntity(hero);

  setupMouseControl(canvas, hero, camera);
  const collisionLayer = createCollisionLayer(room);
  room.addLayer(collisionLayer);

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(hero);

  const timer = new Timer();
  timer.setUpdateFn(deltaTime => {
    const gameContext = { deltaTime } satisfies GameContext;

    room.update(gameContext);
    room.draw(context, camera);
  });

  timer.start();

  window.addEventListener('keydown', e => {
    if (e.code === Keys.KEY_ESCAPE) {
      timer.stop();
      console.log('Timer stopped');
    }
  });
});
