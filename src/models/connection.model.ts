export const ConnectionType = { Default: 'default' } as const;
export type ConnectionType = (typeof ConnectionType)[keyof typeof ConnectionType];

export const ListenByKey = { Reference: 'reference', System: 'system' } as const;
export type ListenByKey = (typeof ListenByKey)[keyof typeof ListenByKey];

export class Connection {
  public connectionType: ConnectionType;

  public connectionId: string;

  public connectedAt: number;

  public listenByKey: ListenByKey;

  public listenByValue: string;

  constructor(data: Connection) {
    this.connectionType = data.connectionType;
    this.connectionId = data.connectionId;
    this.connectedAt = data.connectedAt;
    this.listenByKey = data.listenByKey;
    this.listenByValue = data.listenByValue;
  }
}
