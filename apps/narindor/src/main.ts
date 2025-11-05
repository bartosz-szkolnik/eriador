import './style.css';
import { Timer, type GameContext } from '@eriador/core';
import { Camera, initializeCanvas, Keys, setupMouseControl } from '@eriador/common';
import { createHero } from './entities';
import { setupKeyboard } from './input';
import { loadRoom } from './loaders';
// import { createCameraLayer, createCollisionLayer } from './layers';

// Todo: Figure out how wide the canvas should be
const { context, canvas } = initializeCanvas({ elementId: 'screen', width: 256 + 16, height: 240 });

Promise.all([createHero(), loadRoom('debug-simple')]).then(([hero, room]) => {
  const camera = new Camera();
  hero.position.set(64, 64);
  room.addEntity(hero);

  setupMouseControl(canvas, hero, camera);

  // room.addLayer(createCollisionLayer(room));
  // room.addLayer(createCameraLayer(camera));

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
