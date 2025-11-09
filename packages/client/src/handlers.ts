import type { SessionBroadcastMessage, SessionCreatedMessage } from '@eriador/server';

export function handleSessionCreated(message: SessionCreatedMessage) {
  window.location.hash = message.sessionId;
}

export function handleSessionBroadcast<TData>(message: SessionBroadcastMessage<TData>, peers: Set<string>) {
  if (!message.peers) {
    return;
  }

  const me = message.peers.you;
  message.peers.clients
    .filter(client => client.id !== me)
    .forEach(client => {
      peers.add(client.id);
    });

  peers.forEach(peer => {
    if (message.peers.clients.find(client => client.id === peer)) {
      return;
    }

    peers.delete(peer);
  });
}
