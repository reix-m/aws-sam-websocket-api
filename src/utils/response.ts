export type Response = {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
};
export function response(code: number, data: Record<string, unknown>): Response {
  return {
    statusCode: code,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
}

export function responseError(code: number, message: string): Response {
  return {
    statusCode: code,
    body: JSON.stringify({ statusCode: code, message: message }),
    headers: { 'Content-Type': 'application/json' },
  };
}
