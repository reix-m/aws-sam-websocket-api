import { ConnectionRepository } from '../repositories/connection.repository';
import { Exception } from '../utils/exception';
import { StatusCodes } from '../utils/status-codes';

export class DisconnectHandler {
  constructor(private readonly repo: ConnectionRepository) {}

  public async execute(connectionId: string): Promise<{ success: boolean }> {
    if (!connectionId) {
      throw new Exception(StatusCodes.BadRequest, '"connectionId" is required.');
    }
    await this.repo.delete(connectionId);
    return { success: true };
  }
}
