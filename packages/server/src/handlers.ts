import type { Client } from './client.ts';
import type { Session } from './session.ts';
import {
  SESSION_CREATED,
  type CreateSessionMessage,
  type HandlerContextWithMessage,
  type JoinSessionMessage,
} from './types.ts';
import { broadcastSession, createSession, getSession } from './utils.ts';

export function handleCreateSession<TData>(context: HandlerContextWithMessage<TData, CreateSessionMessage<TData>>) {
  const { client, sessions, message } = context;
  const session = createSession<TData>();

  session.join(client);
  client.state = message.data;

  sessions.set(session.id, session);
  client.send({
    type: SESSION_CREATED,
    sessionId: session.id,
  });
}

export function handleJoinSession<TData>(context: HandlerContextWithMessage<TData, JoinSessionMessage<TData>>) {
  const { client, sessions, message } = context;
  const { sessionId, data } = message;

  if (sessionId) {
    const session = getSession(sessionId, sessions) ?? createSession(sessionId);
    session.join(client);

    client.state = data;

    sessions.set(sessionId, session);
    broadcastSession<TData>(session);
  }
}

export function handleConnectionClose<TData>(client: Client<TData>, sessions: Map<string, Session<TData>>) {
  const session = client.session;
  if (session) {
    session.leave(client);
    if (session.clients.size === 0) {
      sessions.delete(session.id);
    }

    broadcastSession<TData>(session);
  }
}
