import {
  ApiGatewayManagementApiClient,
  GoneException,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Connection, ConnectionType, ListenByKey } from '../models/connection.model';
import { SendEventPort } from '../ports/send-event.port';
import { ConnectionRepository } from '../repositories/connection.repository';

export class SendEventHandler {
  constructor(
    private readonly repo: ConnectionRepository,
    private readonly apiGwClient: ApiGatewayManagementApiClient
  ) {}

  public async execute(port: SendEventPort): Promise<void> {
    const BATCH_SIZE: number = 10;
    for await (const connectionList of this.getConnections()) {
      await this.processInBatches(connectionList, async (item: Connection) => this.sendEvent(item, port), BATCH_SIZE);
    }
  }

  private async sendEvent(connection: Connection, port: SendEventPort): Promise<void> {
    try {
      if (!this.isConnectionListenByEvent(connection, port)) return;
      const command: PostToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: connection.connectionId,
        Data: Buffer.from(JSON.stringify(port.event)),
      });
      await this.apiGwClient.send(command);
    } catch (error) {
      console.error(error);
      if (error instanceof GoneException) {
        await this.repo.delete(connection.connectionId);
      }
    }
  }

  private isConnectionListenByEvent(connection: Connection, port: SendEventPort): boolean {
    if (connection.listenByKey === ListenByKey.System && port.event.system === connection.listenByValue) return true;
    if (connection.listenByKey === ListenByKey.Reference && port.event.reference === connection.listenByValue)
      return true;
    return false;
  }

  private async *getConnections(): AsyncGenerator<Connection[]> {
    const PER_PAGE: number = 25;
    let lastKey: Record<string, AttributeValue> = undefined;
    while (true) {
      const connections: { data: Connection[]; lastKey?: Record<string, AttributeValue> } =
        await this.repo.getByConnectionType({ connectionType: ConnectionType.Default }, { limit: PER_PAGE, lastKey });
      if (!connections.data.length) break;
      yield connections.data;
      lastKey = connections.lastKey;
      if (!lastKey) break;
    }
  }

  private async processInBatches<T>(items: T[], handler: (item: T) => Promise<void>, batchSize: number): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch: T[] = items.slice(i, i + batchSize);
      await Promise.all(batch.map(handler));
    }
  }
}
