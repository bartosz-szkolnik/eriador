import type { Client } from './client';

export class Session<TData> {
  readonly clients = new Set<Client<TData>>();
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  join(client: Client<TData>) {
    if (client.session) {
      throw new Error('Client already in session.');
    }

    this.clients.add(client);
    client.session = this;
  }

  leave(client: Client<TData>) {
    if (!client.session) {
      throw new Error('Client not in session.');
    }

    this.clients.delete(client);
    client.session = null;
  }
}
