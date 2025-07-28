import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SQSBatchItemFailure, SQSBatchResponse, SQSEvent } from 'aws-lambda';
import { AppConfig } from '../config/app.config';
import { SendEventHandler } from '../handlers/send-event.handler';
import { SendEventPort } from '../ports/send-event.port';
import { ConnectionRepository } from '../repositories/connection.repository';

const ddbClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const apiGwClient: ApiGatewayManagementApiClient = new ApiGatewayManagementApiClient({
  endpoint: AppConfig.WsEndpoint,
});

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures: SQSBatchItemFailure[] = [];
  const repo: ConnectionRepository = new ConnectionRepository(ddbClient);
  const handler: SendEventHandler = new SendEventHandler(repo, apiGwClient);
  const promises: Promise<void>[] = event.Records.map(async (record) => {
    try {
      const port: SendEventPort = new SendEventPort({
        event: JSON.parse(record.body),
      });
      await handler.execute(port);
    } catch (error) {
      console.error('Send event error:', error);
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  });
  await Promise.all(promises);
  return { batchItemFailures: batchItemFailures };
};
