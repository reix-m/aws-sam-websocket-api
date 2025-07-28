import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'node:crypto';
import { DisconnectHandler } from '../../src/handlers/disconnect.handler';
import { ConnectionRepository } from '../../src/repositories/connection.repository';
import { Exception } from '../../src/utils/exception';
import { StatusCodes } from '../../src/utils/status-codes';

describe('Disconnect Handler', () => {
  const repo: ConnectionRepository = createMock();
  const handler: DisconnectHandler = new DisconnectHandler(repo);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw Exception when connectedId is not valid', async () => {
    const connectionId = undefined;
    let error: Exception;
    try {
      await handler.execute(connectionId);
    } catch (e) {
      error = e as Exception;
    }
    expect(error).toBeInstanceOf(Exception);
    expect(error.code).toBe(StatusCodes.BadRequest);
  });

  test('should return success equal to true when client is disconnected', async () => {
    const connectionId: string = randomUUID();
    const result: { success: boolean } = await handler.execute(connectionId);
    expect(result.success).toBeTruthy();
  });
});
