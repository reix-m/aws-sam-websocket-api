export class Exception extends Error {
  public readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}
