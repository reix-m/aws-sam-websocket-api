export class AppConfig {
  public static readonly TableName: string = process.env.WS_CONNECTIONS_TABLE_NAME;

  public static readonly WsEndpoint: string = process.env.WS_ENDPOINT;
}

export class AuthConfig {
  public static readonly VerifyTokenUrl: string = process.env.AUTH_VERIFY_TOKEN_URL;
}
