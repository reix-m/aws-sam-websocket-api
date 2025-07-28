import { AttributeValue, QueryCommand, QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { AppConfig } from '../config/app.config';
import { Connection, ConnectionType, ListenByKey } from '../models/connection.model';

export class ConnectionRepository {
  private readonly tableName: string = AppConfig.TableName;

  constructor(private readonly client: DynamoDBDocumentClient) {}

  public async save(connection: Connection): Promise<void> {
    const command: PutCommand = new PutCommand({
      TableName: this.tableName,
      Item: {
        connectionType: connection.connectionType,
        connectionId: connection.connectionId,
        connectedAt: connection.connectedAt,
        listenByKey: connection.listenByKey,
        listenByValue: connection.listenByValue,
      },
    });
    await this.client.send(command);
  }

  public async delete(connectionId: String): Promise<void> {
    const command: DeleteCommand = new DeleteCommand({
      TableName: this.tableName,
      Key: { connectionId: connectionId },
    });
    await this.client.send(command);
  }

  public async getByConnectionType(
    by: { connectionType: ConnectionType },
    options?: { limit?: number; lastKey?: Record<string, AttributeValue> }
  ): Promise<{ data: Connection[]; lastKey?: Record<string, AttributeValue> }> {
    const command: QueryCommand = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'ByConnectionType',
      KeyConditionExpression: 'connectionType = :type',
      ExpressionAttributeValues: { ':type': { S: by.connectionType } },
      Limit: options?.limit,
      ExclusiveStartKey: options.lastKey,
    });
    const result: QueryCommandOutput = await this.client.send(command);
    if (!result.Items?.length) return { data: [], lastKey: null };
    const connections: Connection[] = result.Items.map(
      (item) =>
        new Connection({
          connectionId: item.connectionId.S,
          connectionType: item.connectionType.S as ConnectionType,
          connectedAt: Number(item.connectedAt.N),
          listenByKey: item.listenByKey.S as ListenByKey,
          listenByValue: item.listenByValue.S,
        })
    );
    return { data: connections, lastKey: result.LastEvaluatedKey };
  }
}
