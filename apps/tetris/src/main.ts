import './style.css';

import { startSinglePlayerTetris } from './modes/single-player';
import { startTwoPlayersTetris } from './modes/two-players';
import { startMultiPlayerTetris } from './modes/multi-player';
import { TetrisMainMenu } from './components/main-menu';
import { initializeCanvas, Keys } from '@eriador/common';
import { loadFont } from './utils/font';
import { wait } from './utils';

export const WE_WORK_IN_SECONDS = 1000;
export const DROP_TIME = 1000; //  1 second - easier
// export const DROP_TIME = 500; // 0.5 second - harder

export type Mode = 'ONE PLAYER' | 'TWO PLAYERS' | 'MULTI PLAYER';
const MODES = ['ONE PLAYER', 'TWO PLAYERS', 'MULTI PLAYER'] satisfies Mode[];

const font = await loadFont();
const { context, canvas } = initializeCanvas({ elementId: 'main-menu', width: 240, height: 400 });

// If we have a hash id in the address url, it usually means somebody else has
// sent us this link to play, which means we want to immediately turn on multiplayer mode
if (window.location.hash.split('#')[1]) {
  document.body.removeChild(canvas);
  startTetris('MULTI PLAYER');
} else {
  const mainMenu = new TetrisMainMenu<Mode>(MODES);
  mainMenu.draw(context, font);

  async function handler(event: KeyboardEvent) {
    if (event.code === Keys.KEY_ARROW_UP) {
      mainMenu.handleArrowUp();
    }

    if (event.code === Keys.KEY_ARROW_DOWN) {
      mainMenu.handleArrowDown();
    }

    if (event.code === Keys.KEY_ENTER) {
      const mode = mainMenu.handleEnter();

      document.body.removeChild(canvas);
      document.removeEventListener('keydown', handler);

      // this thing is needed because after we choose a mode with enter, in two player mode,
      // the enter is immediately captured as player dropToBottom move, which is wrong.
      // Don't know how to fix it properly yet.
      await wait(0.001);

      startTetris(mode);
      return;
    }

    mainMenu.draw(context, font);
  }

  document.addEventListener('keydown', handler);
}

function startTetris(mode: Mode) {
  if (mode === 'ONE PLAYER') {
    startSinglePlayerTetris();
  } else if (mode === 'TWO PLAYERS') {
    startTwoPlayersTetris();
  } else {
    startMultiPlayerTetris();
  }
}
