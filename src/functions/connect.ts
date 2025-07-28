import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ConnectHandler } from '../handlers/connect.handler';
import { ListenByKey } from '../models/connection.model';
import { ConnectPort } from '../ports/connect.port';
import { ConnectionRepository } from '../repositories/connection.repository';
import { AuthService } from '../services/auth.service';
import { Exception } from '../utils/exception';
import { response, responseError } from '../utils/response';
import { StatusCodes } from '../utils/status-codes';

const ddbClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const repo: ConnectionRepository = new ConnectionRepository(ddbClient);
    const authService: AuthService = new AuthService();
    const handler: ConnectHandler = new ConnectHandler(repo, authService);
    const port: ConnectPort = new ConnectPort({
      token: event.queryStringParameters?.token || '',
      connectionId: event.requestContext.connectionId || '',
      connectedAt: event.requestContext.connectedAt ? event.requestContext.connectedAt : Date.now(),
      listenByKey: (event.queryStringParameters?.listenByKey as ListenByKey) || undefined,
      listenByValue: event.queryStringParameters?.listenByValue || '',
    });
    const result: { success: boolean } = await handler.execute(port);
    if (result.success) {
      return response(StatusCodes.Ok, { success: result.success });
    }
    return responseError(StatusCodes.InternalServerError, 'Não foi possível conectar, tente novamente.');
  } catch (error) {
    let message: string = 'Ocorreu um erro interno, tente novamente.';
    let code: number = StatusCodes.InternalServerError;
    if (error instanceof Exception) {
      message = error.message;
      code = error.code;
    }
    console.error('Connect error:', error);
    return responseError(code, message);
  }
};
