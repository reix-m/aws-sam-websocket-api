import { ApiGatewayManagementApiClient, GoneException } from '@aws-sdk/client-apigatewaymanagementapi';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { randomUUID } from 'node:crypto';
import { SendEventHandler } from '../../src/handlers/send-event.handler';
import { Connection, ConnectionType, ListenByKey } from '../../src/models/connection.model';
import { SendEventPort } from '../../src/ports/send-event.port';
import { ConnectionRepository } from '../../src/repositories/connection.repository';

describe('Send Event Handler', () => {
  const repo: DeepMocked<ConnectionRepository> = createMock();
  const apiGwClient: DeepMocked<ApiGatewayManagementApiClient> = createMock();
  const handler: SendEventHandler = new SendEventHandler(repo, apiGwClient);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    test('should delete connection when connection is closed', async () => {
      const port: SendEventPort = makeEventPort();
      const connection: Connection = new Connection({
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        connectionType: ConnectionType.Default,
        listenByKey: ListenByKey.Reference,
        listenByValue: port.event.reference,
      });
      repo.getByConnectionType
        .mockResolvedValueOnce({ data: [connection], lastKey: undefined })
        .mockResolvedValue({ data: [], lastKey: undefined });
      apiGwClient.send.mockRejectedValue(new GoneException({ message: 'connection closed', $metadata: {} }) as never);
      await handler.execute(port);
      expect(repo.delete).toHaveBeenCalledWith(connection.connectionId);
    });

    test('should not send event to connection when it not listen by this event', async () => {
      const port: SendEventPort = makeEventPort();
      const connection: Connection = new Connection({
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        connectionType: ConnectionType.Default,
        listenByKey: ListenByKey.Reference,
        listenByValue: randomUUID(),
      });
      repo.getByConnectionType
        .mockResolvedValueOnce({ data: [connection], lastKey: undefined })
        .mockResolvedValue({ data: [], lastKey: undefined });
      apiGwClient.send.mockResolvedValue({} as never);
      await handler.execute(port);
      expect(apiGwClient.send).not.toHaveBeenCalled();
    });

    test('should send event to connection when it listen by reference', async () => {
      const port: SendEventPort = makeEventPort();
      const connection: Connection = new Connection({
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        connectionType: ConnectionType.Default,
        listenByKey: ListenByKey.Reference,
        listenByValue: port.event.reference,
      });
      await expectItSendEventToConnection(port, connection, repo, apiGwClient, handler);
    });

    test('should send event to connection when it listen by system', async () => {
      const port: SendEventPort = makeEventPort();
      const connection: Connection = new Connection({
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        connectionType: ConnectionType.Default,
        listenByKey: ListenByKey.System,
        listenByValue: port.event.system,
      });
      await expectItSendEventToConnection(port, connection, repo, apiGwClient, handler);
    });
  });
});

async function expectItSendEventToConnection(
  port: SendEventPort,
  connection: Connection,
  repo: DeepMocked<ConnectionRepository>,
  apiGwClient: DeepMocked<ApiGatewayManagementApiClient>,
  handler: SendEventHandler
): Promise<void> {
  repo.getByConnectionType
    .mockResolvedValueOnce({ data: [connection], lastKey: undefined })
    .mockResolvedValue({ data: [], lastKey: undefined });
  apiGwClient.send.mockResolvedValue({} as never);
  await handler.execute(port);
  expect(apiGwClient.send).toHaveBeenCalled();
}

export const makeEventPort = (): SendEventPort => ({
  event: {
    id: '68701cf2d33523c4b1cbcb47',
    title: 'cbe20856-9d00-4330-ba8f-1abe42de5732',
    reference: randomUUID(),
    description: 'a4da5333-21d4-4e1b-a16d-fb79af7e55e5',
    eventGroupId: '68701cf2d33523c4b1cbcb46',
    system: 'my-system',
    systemName: 'My System',
    eventDate: new Date('2025-07-10T20:05:06.735Z'),
    isPublic: true,
    user: {
      username: '0f79f806-921a-4fa8-8606-8b30133d5ac1',
      name: 'b82fdc61-ae41-4679-8a12-77442384ddce',
    },
    createdAt: 1752177906735,
  },
});
