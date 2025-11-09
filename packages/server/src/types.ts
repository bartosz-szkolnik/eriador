import type { Client } from './client';
import type { Session } from './session';
import type { WebSocket } from 'ws';

export const CREATE_SESSION = 'create-session';
export const SESSION_CREATED = 'session-created';
export const JOIN_SESSION = 'join-session';
export const SESSION_BROADCAST = 'session-broadcast';
export const CUSTOM_MESSAGE = 'custom-message';
export const BROADCAST_CUSTOM_MESSAGE = 'broadcast-custom-message';

export const INTERNAL_TYPES = [CREATE_SESSION, SESSION_CREATED, JOIN_SESSION, SESSION_BROADCAST] as const;

export type InternalType = (typeof INTERNAL_TYPES)[number];

export type Message<TData> = InternalMessage<TData> | CustomMessage<TData>;

export type HandlerContext<TData> = {
  client: Client<TData>;
  sessions: Map<string, Session<TData>>;
  conn: WebSocket;
};

export type HandlerContextWithMessage<TData, TMessage extends InternalMessage<TData>> = HandlerContext<TData> & {
  message: TMessage;
};

export type InternalMessage<TData> = CreateSessionMessage<TData> | JoinSessionMessage<TData> | SessionCreatedMessage;

export type CreateSessionMessage<TData> = {
  type: typeof CREATE_SESSION;
  data: TData;
};

export type SessionCreatedMessage = {
  type: typeof SESSION_CREATED;
  sessionId: string;
};

export type JoinSessionMessage<TData> = {
  type: typeof JOIN_SESSION;
  sessionId: string;
  data: TData;
};

// This one is used by the server to inform all the cliens of a session about
// the change of participants (someone joined or left).
export type SessionBroadcastMessage<TData> = {
  type: typeof SESSION_BROADCAST;
  // data: TData;
  // id: string;
  peers: {
    you: string;
    clients: {
      id: string;
      state: TData;
    }[];
  };
};

// This one is used to inform all the clients of a session of the state update
// that has been sent by one client in CustomMessage
export type BroadcastCustomMessage<TData> = Omit<CustomMessage<TData>, 'type'> & {
  type: typeof BROADCAST_CUSTOM_MESSAGE;
  clientId: string;
};

export type CustomMessage<TData> = {
  type: typeof CUSTOM_MESSAGE;
  customType: string;
  data: TData;
};
