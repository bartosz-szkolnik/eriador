import { EventEmitter } from '@eriador/core';
import {
  type JoinSessionMessage,
  JOIN_SESSION,
  type CreateSessionMessage,
  CREATE_SESSION,
  type CustomMessage,
  CUSTOM_MESSAGE,
  SESSION_BROADCAST,
} from '@eriador/server';
import { isBroadcastCustomMessage, isSessionBroadcast, isSessionCreatedMessage } from '@eriador/server/src/guards';
import { handleSessionBroadcast, handleSessionCreated } from './handlers';

type ConnectionManagerOptions = {
  showLogs?: boolean;
  errorMessage?: string;
};

type Events = typeof SESSION_BROADCAST;

export class ConnectionManager<TData, TEvents extends string> {
  private readonly events = new EventEmitter<Events | TEvents>();
  private conn: WebSocket | null = null;
  private connected = false;

  readonly peers = new Set<string>();

  constructor(private readonly options: ConnectionManagerOptions = { showLogs: false, errorMessage: '' }) {}

  connect(address: string, initialState: TData) {
    this.conn = new WebSocket(address);

    this.conn.addEventListener('open', () => {
      this.log('[WS] Connection established.');
      this.connected = true;
      this.initSession(initialState);
    });

    this.conn.addEventListener('message', event => {
      this.log('[WS] Received message', event.data);
      this.receive(event.data);
    });

    this.conn.addEventListener('error', () => {
      if (this.options.errorMessage) {
        console.error(this.options.errorMessage);
      }
    });

    this.conn.addEventListener('close', () => {
      this.disconnect();
    });
  }

  on<T>(eventName: Events | TEvents, callback: (data: T) => void) {
    this.events.listen(eventName, callback);
  }

  sendData<T>(data: Omit<CustomMessage<T>, 'type'>) {
    this.send({ ...data, type: CUSTOM_MESSAGE });
  }

  disconnect() {
    this.connected = false;
    this.conn?.close();
  }

  private initSession(initialState: TData) {
    const sessionId = window.location.hash.split('#')[1];

    if (sessionId) {
      this.send<JoinSessionMessage<TData>>({
        sessionId,
        type: JOIN_SESSION,
        data: initialState,
      });
    } else {
      this.send<CreateSessionMessage<TData>>({
        type: CREATE_SESSION,
        data: initialState,
      });
    }
  }

  private send<T>(message: T) {
    const msg = JSON.stringify(message);
    if (!this.connected) {
      return;
    }

    this.log('[WS] Sending message', msg);
    this.conn?.send(msg);
  }

  private receive(msg: string) {
    const message = JSON.parse(msg);

    if (isSessionCreatedMessage(message)) {
      handleSessionCreated(message);
    }

    if (isSessionBroadcast<TData>(message)) {
      handleSessionBroadcast<TData>(message, this.peers);

      const states = new Map<string, TData>();
      message.peers.clients.forEach(client => states.set(client.id, client.state));

      this.events.emit(SESSION_BROADCAST, { peers: this.peers, states });
    }

    if (isBroadcastCustomMessage<TData>(message)) {
      const { type: _, customType, ...rest } = message;
      this.events.emit(customType as TEvents, rest);
    }
  }

  private log(...texts: string[]) {
    if (this.options.showLogs) {
      console.info(...texts);
    }
  }
}

export { SESSION_BROADCAST };
