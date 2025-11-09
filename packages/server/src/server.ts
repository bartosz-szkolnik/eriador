import { WebSocketServer, type AddressInfo } from 'ws';
import { EventEmitter } from '@eriador/core/src/event-emitter.ts';
import { handleConnectionClose, handleCreateSession, handleJoinSession } from './handlers.ts';
import * as guards from './guards.ts';
import type { Session } from './session.ts';
import { type HandlerContext, type InternalType, type Message } from './types.ts';
import { createClient } from './utils.ts';

type InitializeServerOptions = {
  showLogs?: boolean;
  listenOnInternals?: boolean;
};

export function initializeServer<TData>(
  port: number,
  options: InitializeServerOptions = { showLogs: false, listenOnInternals: false },
) {
  const server = new WebSocketServer({ port });
  const { showLogs, listenOnInternals } = options;

  const sessions = new Map<string, Session<TData>>();
  const events = new EventEmitter<InternalType>();

  server.on('connection', conn => {
    log('[WS] Connection established.');
    const client = createClient<TData>(conn);

    function log(...texts: string[]) {
      if (showLogs) {
        console.info(...texts);
      }
    }

    conn.on('message', (msg: string) => {
      log(`[WS] Message from client ${client.id} received: ${msg}.`);

      const message = JSON.parse(msg) as Message<TData>;
      if (listenOnInternals && guards.isInternalMessage(message)) {
        events.emit(message.type, message);
      }

      const context = { client, conn, sessions } satisfies HandlerContext<TData>;
      if (guards.isCreateSessionMessage<TData>(message)) {
        log(`[WS] Creating a new session per request of client ${client.id}.`);
        handleCreateSession({ message, ...context });
      }

      if (guards.isJoinSessionMessage<TData>(message)) {
        log(`[WS] Joining client ${client.id} to session ${message.sessionId}.`);
        handleJoinSession({ message, ...context });
      }

      if (guards.isCustomMessage<TData>(message)) {
        log(`[WS] Client ${client.id} sent a custom message ${message.type}.`);
        client.broadcast(message);
      }
    });

    conn.on('close', () => {
      log(`[WS] Connection with client ${client.id} closed.`);
      handleConnectionClose<TData>(client, sessions);
    });
  });

  server.on('listening', () => {
    const port = (server.address() as AddressInfo).port;
    console.info(`WebSocket server created on port ${port} and listening...`);
  });

  return { server, events };
}
