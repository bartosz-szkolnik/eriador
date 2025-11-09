import {
  BROADCAST_CUSTOM_MESSAGE,
  CREATE_SESSION,
  JOIN_SESSION,
  type BroadcastCustomMessage,
  type CreateSessionMessage,
  type JoinSessionMessage,
  type InternalMessage,
  type CustomMessage,
  type SessionCreatedMessage,
  type SessionBroadcastMessage,
  type Message,
  INTERNAL_TYPES,
  SESSION_CREATED,
  SESSION_BROADCAST,
  CUSTOM_MESSAGE,
} from './types.ts';

export function isInternalMessage<TData>(message: Message<TData>): message is InternalMessage<TData> {
  return INTERNAL_TYPES.includes(message.type as InternalMessage<TData>['type']);
}

export function isCreateSessionMessage<TData>(message: unknown): message is CreateSessionMessage<TData> {
  if (!isMessage(message)) {
    return false;
  }

  return message.type === CREATE_SESSION;
}

export function isJoinSessionMessage<TData>(message: unknown): message is JoinSessionMessage<TData> {
  if (!isMessage(message)) {
    return false;
  }

  return message.type === JOIN_SESSION;
}

export function isBroadcastCustomMessage<TData>(message: unknown): message is BroadcastCustomMessage<TData> {
  if (!isMessage(message)) {
    return false;
  }

  return message.type === BROADCAST_CUSTOM_MESSAGE;
}

export function isSessionCreatedMessage(message: unknown): message is SessionCreatedMessage {
  if (!isMessage(message)) {
    return false;
  }

  return message.type === SESSION_CREATED;
}

export function isSessionBroadcast<TData>(message: unknown): message is SessionBroadcastMessage<TData> {
  if (!isMessage(message)) {
    return false;
  }

  return message.type === SESSION_BROADCAST;
}

export function isCustomMessage<TData>(message: unknown): message is CustomMessage<TData> {
  if (!isMessage(message)) {
    return false;
  }

  return message.type === CUSTOM_MESSAGE;
}

function isMessage(message: unknown): message is { type: string } {
  if (!message || typeof message !== 'object') {
    return false;
  }

  return Object.hasOwn(message, 'type');
}
