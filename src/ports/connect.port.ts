import { ListenByKey } from '../models/connection.model';
import { Exception } from '../utils/exception';
import { StatusCodes } from '../utils/status-codes';

export class ConnectPort {
  public token: string;

  public connectionId: string;

  public connectedAt: number;

  public listenByKey: ListenByKey;

  public listenByValue: string;

  constructor(data: ConnectPort) {
    if (!data.token) {
      throw new Exception(StatusCodes.BadRequest, '"token" is required.');
    }
    this.token = data.token;
    if (!data.connectionId) {
      throw new Exception(StatusCodes.BadRequest, '"connectionId" is required.');
    }
    this.connectionId = data.connectionId;
    if (!data.listenByKey) {
      throw new Exception(StatusCodes.BadRequest, '"listenByKey" is required.');
    }
    if (!Object.values(ListenByKey).includes(data.listenByKey)) {
      throw new Exception(
        StatusCodes.BadRequest,
        `"listenByKey" field must be ${Object.values(ListenByKey).join(', ')}.`
      );
    }
    this.listenByKey = data.listenByKey;
    if (!data.listenByValue) {
      throw new Exception(StatusCodes.BadRequest, '"listenByValue" is required.');
    }
    this.listenByValue = data.listenByValue;
    this.connectedAt = data.connectedAt ?? Date.now();
  }
}
