import { randomUUID } from 'node:crypto';
import { ListenByKey } from '../../src/models/connection.model';
import { ConnectPort } from '../../src/ports/connect.port';

describe('Connect Port', () => {
  test('should throw Error when "token" is not valid', () => {
    let error: Error;
    try {
      new ConnectPort({
        token: undefined,
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        listenByKey: ListenByKey.System,
        listenByValue: randomUUID(),
      });
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('"token" is required.');
  });

  test('should throw Error when "connectionId" is not valid', () => {
    let error: Error;
    try {
      new ConnectPort({
        token: randomUUID(),
        connectionId: undefined,
        connectedAt: Date.now(),
        listenByKey: ListenByKey.System,
        listenByValue: randomUUID(),
      });
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('"connectionId" is required.');
  });

  test('should throw Error when "listenByKey" is empty', () => {
    let error: Error;
    try {
      new ConnectPort({
        token: randomUUID(),
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        listenByKey: undefined,
        listenByValue: randomUUID(),
      });
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('"listenByKey" is required.');
  });

  test('should throw Error when "listenByKey" is not valid', () => {
    let error: Error;
    try {
      new ConnectPort({
        token: randomUUID(),
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        listenByKey: 'invalid' as ListenByKey,
        listenByValue: randomUUID(),
      });
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`"listenByKey" field must be ${Object.values(ListenByKey).join(', ')}.`);
  });

  test('should throw Error when "listenByValue" is empty', () => {
    let error: Error;
    try {
      new ConnectPort({
        token: randomUUID(),
        connectionId: randomUUID(),
        connectedAt: Date.now(),
        listenByKey: ListenByKey.Reference,
        listenByValue: undefined,
      });
    } catch (e) {
      error = e as Error;
    }
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('"listenByValue" is required.');
  });

  test('should create port without optional fields', () => {
    const token: string = randomUUID();
    const connectionId: string = randomUUID();
    const port: ConnectPort = new ConnectPort({
      token,
      connectionId,
      connectedAt: undefined,
      listenByKey: ListenByKey.System,
      listenByValue: randomUUID(),
    });
    expect(port.token).toBe(token);
    expect(port.connectionId).toBe(connectionId);
    expect(port.connectedAt).toEqual(expect.any(Number));
  });

  test('should create port with optional fields', () => {
    const token: string = randomUUID();
    const connectionId: string = randomUUID();
    const connectedAt: number = Date.now() - 10000;
    const port: ConnectPort = new ConnectPort({
      token,
      connectionId,
      connectedAt,
      listenByKey: ListenByKey.System,
      listenByValue: randomUUID(),
    });
    expect(port.token).toBe(token);
    expect(port.connectionId).toBe(connectionId);
    expect(port.connectedAt).toBe(connectedAt);
  });
});
