import { initializeServer } from '@eriador/server';
import type { SerializedState } from './components/state';

const port = 9000;
initializeServer<SerializedState>(port, { listenOnInternals: true, showLogs: true });
