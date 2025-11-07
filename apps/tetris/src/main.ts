import './style.css';
import { startSinglePlayerTetris } from './modes/single-player';
import { startTwoPlayersTetris } from './modes/two-players';

export const WE_WORK_IN_SECONDS = 1000;
export const DROP_TIME = 1000; //  1 second - easier
// export const DROP_TIME = 500; // 0.5 second - harder

// type Mode = 'single-player' | 'two-players';

// const mode: Mode = 'two-players';
// if (mode === 'single-player') {
startSinglePlayerTetris();
// } else if (mode === 'two-players') {
// startTwoPlayersTetris();
// }
