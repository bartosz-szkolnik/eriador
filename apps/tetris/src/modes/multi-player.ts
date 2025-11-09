import { Keys } from '@eriador/common';
import { ConnectionManager, SESSION_BROADCAST } from '@eriador/client';
import { TetrisBuilder } from '../components/tetris-builder';
import { TetrisManager } from '../components/tetris-manager';
import { Timer } from '@eriador/core';
import { WE_WORK_IN_SECONDS } from '../main';
import { setupKeyboardForOnePlayer } from '../utils/input';
import { serializeState, type SerializedState, type State } from '../components/state';

const LOCAL_PLAYER_ID = 'local';
const UPDATE_STATE = 'update-state';

type Events = typeof UPDATE_STATE;
const builder = new TetrisBuilder(document);

export function startMultiPlayerTetris() {
  const manager = new TetrisManager(document);

  const localPlayer = builder.createTetrisGame();
  localPlayer.tetris.parentElement.classList.add('local');
  manager.addInstance(LOCAL_PLAYER_ID, localPlayer);

  const errorMessage = `You have to firstly instantiate the server. Run \`pnpm run server\` in a terminal window.`;
  const connectionManager = new ConnectionManager<SerializedState, Events>({ showLogs: false, errorMessage });
  const initialState = serializeState(localPlayer.tetris.getState());

  connectionManager.connect('ws://localhost:9000', initialState);
  connectionManager.on(SESSION_BROADCAST, (data: { peers: Set<string>; states: Map<string, SerializedState> }) => {
    const { peers, states } = data;
    peers.forEach(peerId => {
      if (manager.includes(peerId)) {
        return;
      }

      const tetrisPair = builder.createTetrisGame();
      manager.addInstance(peerId, tetrisPair);

      const state = states.get(peerId);
      if (state) {
        manager.updateInstance(peerId, state);
      }
    });

    manager.games.forEach((tetrisGame, id) => {
      if (id === LOCAL_PLAYER_ID) {
        return;
      }

      if (!peers.has(id)) {
        manager.removeInstance(id, tetrisGame);
      }
    });
  });

  connectionManager.on(UPDATE_STATE, (message: { clientId: string; data: SerializedState }) => {
    const { clientId, data } = message;
    manager.updateInstance(clientId, data);
  });

  localPlayer.tetris.listenOnStateManagerEvents().listen('STATE_CHANGED', (state: State) => {
    connectionManager.sendData({
      customType: UPDATE_STATE,
      data: serializeState(state),
    });
  });

  const timer = new Timer();
  timer.setUpdateFn(deltaTime => {
    const dt = deltaTime * WE_WORK_IN_SECONDS;
    localPlayer.tetris.update(dt);
    localPlayer.tetris.render(localPlayer.renderer);
  });

  const inputRouter = setupKeyboardForOnePlayer(window);
  inputRouter.addReceiver(localPlayer.tetris.player);

  timer.start();

  window.addEventListener('keydown', e => {
    if (e.code === Keys.KEY_ESCAPE) {
      timer.stop();
      console.log('Timer stopped');
    }
  });
}
