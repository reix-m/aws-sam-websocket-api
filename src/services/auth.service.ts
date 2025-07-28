import { AuthConfig } from '../config/app.config';
import { Exception } from '../utils/exception';
import { StatusCodes } from '../utils/status-codes';

export class AuthService {
  private readonly url: string = AuthConfig.VerifyTokenUrl;

  public async isTokenValid(data: { token: string }): Promise<boolean> {
    const response: Response = await fetch(this.url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.token}` },
    });
    if (response.status === StatusCodes.Unauthorized) {
      return false;
    }
    if (!response.ok) {
      throw new Exception(response.status, 'Error on validate token.');
    }
    return true;
  }
}
