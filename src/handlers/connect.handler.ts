import { Connection, ConnectionType } from '../models/connection.model';
import { ConnectPort } from '../ports/connect.port';
import { ConnectionRepository } from '../repositories/connection.repository';
import { AuthService } from '../services/auth.service';
import { Exception } from '../utils/exception';
import { StatusCodes } from '../utils/status-codes';

export class ConnectHandler {
  constructor(
    private readonly repo: ConnectionRepository,
    private readonly authService: AuthService
  ) {}

  public async execute(port: ConnectPort): Promise<{ success: boolean }> {
    const isTokenValid: boolean = await this.authService.isTokenValid({ token: port.token });
    if (!isTokenValid) {
      throw new Exception(StatusCodes.Unauthorized, 'Unauthorized');
    }
    const connection: Connection = new Connection({
      connectionType: ConnectionType.Default,
      connectionId: port.connectionId,
      connectedAt: port.connectedAt,
      listenByKey: port.listenByKey,
      listenByValue: port.listenByValue,
    });
    await this.repo.save(connection);
    return { success: true };
  }
}
