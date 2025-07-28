export const StatusCodes = {
  Ok: 200,
  Unauthorized: 401,
  BadRequest: 400,
  InternalServerError: 500,
  NotImplemented: 501,
} as const;
export type StatusCodes = (typeof StatusCodes)[keyof typeof StatusCodes];
