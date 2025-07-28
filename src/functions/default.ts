import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { responseError } from '../utils/response';
import { StatusCodes } from '../utils/status-codes';

export const handler = async (_: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.error('Not implemented.');
  return responseError(StatusCodes.NotImplemented, 'Not implemented');
};
