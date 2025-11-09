import type { WebSocket } from 'ws';
import { Client } from './client.ts';
import { Session } from './session.ts';
import { SESSION_BROADCAST } from './types.ts';

const DEFAULT_CHARS = 'abcdefghjkmnopqrstwxyz0123456789';

export function createId(length = 6, chars = DEFAULT_CHARS) {
  let id = '';
  while (length--) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return id;
}

export function createClient<TData>(conn: WebSocket, id = createId()) {
  return new Client<TData>(conn, id);
}

export function createSession<TData>(id = createId(), sessions = new Map<string, Session<TData>>()) {
  if (sessions.has(id)) {
    throw new Error(`Session ${id} already exist.`);
  }

  const session = new Session<TData>(id);
  sessions.set(id, session);
  return session;
}

export function getSession<TData>(id: string, sessions: Map<string, Session<TData>>) {
  if (!sessions.has(id)) {
    return null;
  }

  return sessions.get(id)!;
}

// This function is used to inform all players in a session that the number of players changed,
// e.g. a new player joined or a player left.
export function broadcastSession<TData>(session: Session<TData>) {
  const clients = [...session.clients];

  clients.forEach(client => {
    client.send({
      type: SESSION_BROADCAST,
      peers: {
        you: client.id,
        clients: clients.map(peer => {
          return {
            id: peer.id,
            state: peer.state!,
          };
        }),
      },
    });
  });
}
