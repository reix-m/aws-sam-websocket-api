import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { randomUUID } from 'node:crypto';
import { ConnectHandler } from '../../src/handlers/connect.handler';
import { ListenByKey } from '../../src/models/connection.model';
import { ConnectPort } from '../../src/ports/connect.port';
import { ConnectionRepository } from '../../src/repositories/connection.repository';
import { AuthService } from '../../src/services/auth.service';
import { Exception } from '../../src/utils/exception';
import { StatusCodes } from '../../src/utils/status-codes';

describe('Connect Handler', () => {
  const repo: ConnectionRepository = createMock();
  const authService: DeepMocked<AuthService> = createMock();
  const handler: ConnectHandler = new ConnectHandler(repo, authService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should throw Exception when token is not valid', async () => {
    const port: ConnectPort = new ConnectPort({
      token: randomUUID(),
      connectionId: randomUUID(),
      connectedAt: Date.now(),
      listenByKey: ListenByKey.System,
      listenByValue: randomUUID(),
    });
    authService.isTokenValid.mockResolvedValue(false);
    let error: Exception;
    try {
      await handler.execute(port);
    } catch (e) {
      error = e as Exception;
    }
    expect(error).toBeInstanceOf(Exception);
    expect(error.code).toBe(StatusCodes.Unauthorized);
  });

  test('should return success equal to true when client is connected', async () => {
    const port: ConnectPort = new ConnectPort({
      token: randomUUID(),
      connectionId: randomUUID(),
      connectedAt: Date.now(),
      listenByKey: ListenByKey.System,
      listenByValue: randomUUID(),
    });
    authService.isTokenValid.mockResolvedValue(true);
    const result: { success: boolean } = await handler.execute(port);
    expect(result.success).toBeTruthy();
  });
});
