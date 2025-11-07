import { Timer } from '@eriador/core';
import { WE_WORK_IN_SECONDS } from '../main';
import { setupKeyboardForTwoPlayers } from '../input';
import { initializeCanvas, Keys } from '@eriador/common';
import { Renderer } from '../components/renderer';
import { Tetris } from '../entities/tetris';

export function startTwoPlayersTetris() {
  const playerElements = document.querySelectorAll<HTMLDivElement>('.player');
  const tetrisPair = [...playerElements].map((element, index) => {
    return initTetrisGame(element, index);
  });

  const timer = new Timer();
  timer.setUpdateFn(deltaTime => {
    const dt = deltaTime * WE_WORK_IN_SECONDS;

    tetrisPair.forEach(({ renderer, tetris }) => {
      tetris.update(dt);
      tetris.render(renderer);
    });
  });

  const inputRouter = setupKeyboardForTwoPlayers(window);

  const [first, second] = tetrisPair.map(pair => pair.tetris.player);
  inputRouter.addReceiver({ first, second });

  timer.start();

  window.addEventListener('keydown', e => {
    if (e.code === Keys.KEY_ESCAPE) {
      timer.stop();
      console.log('Timer stopped');
    }
  });
}

function initTetrisGame(element: HTMLDivElement, index: number) {
  const canvas = document.getElementById(`tetris-${index}`) as HTMLCanvasElement;
  if (!canvas) {
    throw new Error('Could not find a canvas to paint on. Please provide one within the element.');
  }

  const { context } = initializeCanvas({ element: canvas, width: 240, height: 400 });
  context.scale(20, 20);

  const renderer = new Renderer(context);
  const tetris = new Tetris(element.querySelector('.score') as HTMLDivElement);

  return { tetris, renderer };
}
