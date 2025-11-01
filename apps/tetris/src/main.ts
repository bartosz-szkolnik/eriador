import './style.css';

import { initializeCanvas, Keys } from '@beholder/common';
import { Timer } from '@beholder/core';
import { setupKeyboardForOnePlayer } from './input';
import { Renderer } from './components/renderer';
import { Tetris } from './entities/tetris';

const SECONDS = 1000;

const { context } = initializeCanvas({ elementId: 'tetris', width: 240, height: 400 });
context.scale(20, 20);

const renderer = new Renderer(context);
const tetris = new Tetris(document.getElementById('score') as HTMLDivElement);

const timer = new Timer();
timer.setUpdateFn(deltaTime => {
  const dt = deltaTime * SECONDS;
  tetris.update(dt);
  tetris.render(renderer);
});

const inputRouter = setupKeyboardForOnePlayer(window);
inputRouter.addReceiver(tetris.player);

timer.start();

window.addEventListener('keydown', e => {
  if (e.code === Keys.KEY_ESCAPE) {
    timer.stop();
    console.log('Timer stopped');
  }
});
