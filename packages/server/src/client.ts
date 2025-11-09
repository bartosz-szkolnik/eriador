import type { Session } from './session';
import type { WebSocket } from 'ws';
import {
  BROADCAST_CUSTOM_MESSAGE,
  type BroadcastCustomMessage,
  type CustomMessage,
  type SessionBroadcastMessage,
  type SessionCreatedMessage,
} from './types.ts';

export class Client<TData> {
  private readonly conn: WebSocket;
  private readonly showLogs: boolean;

  readonly id: string;

  session: Session<TData> | null = null;
  state: TData | null = null;

  constructor(conn: WebSocket, id: string, showLogs = false) {
    this.conn = conn;
    this.id = id;
    this.showLogs = showLogs;
  }

  send(data: BroadcastCustomMessage<TData> | SessionCreatedMessage | SessionBroadcastMessage<TData>) {
    const msg = JSON.stringify(data);
    this.log(`[WS] Sending message to the client ${this.id}: `, msg);

    this.conn.send(msg, err => {
      if (err) {
        console.error('[WS] Message failed', msg, err);
      }
    });
  }

  broadcast(message: CustomMessage<TData>) {
    if (!this.session) {
      throw new Error('Cannot broadcast without a session.');
    }

    if (message.data) {
      this.state = message.data;
    }

    [...this.session.clients].forEach(client => {
      if (this.id === client.id) {
        return;
      }

      const msg = {
        clientId: this.id,
        customType: message.customType,
        data: message.data,
        type: BROADCAST_CUSTOM_MESSAGE,
      } satisfies BroadcastCustomMessage<TData>;

      client.send(msg);
    });
  }

  private log(...texts: string[]) {
    if (this.showLogs) {
      console.info(...texts);
    }
  }
}
