import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DisconnectHandler } from '../handlers/disconnect.handler';
import { ConnectionRepository } from '../repositories/connection.repository';
import { Exception } from '../utils/exception';
import { response, responseError } from '../utils/response';
import { StatusCodes } from '../utils/status-codes';

const ddbClient: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const repo: ConnectionRepository = new ConnectionRepository(ddbClient);
    const handler: DisconnectHandler = new DisconnectHandler(repo);
    const result: { success: boolean } = await handler.execute(event.requestContext.connectionId);
    if (result.success) {
      return response(StatusCodes.Ok, { success: result.success });
    }
    return responseError(StatusCodes.InternalServerError, 'Não foi possível desconectar, tente novamente.');
  } catch (error) {
    let message: string = 'Ocorreu um erro interno, tente novamente.';
    let code: number = StatusCodes.InternalServerError;
    if (error instanceof Exception) {
      message = error.message;
      code = error.code;
    }
    console.error('Disconnect error:', error);
    return responseError(code, message);
  }
};
