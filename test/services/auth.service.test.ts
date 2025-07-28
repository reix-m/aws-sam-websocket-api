import nock from 'nock';
import { randomUUID } from 'node:crypto';
import { AuthConfig } from '../../src/config/app.config';
import { AuthService } from '../../src/services/auth.service';
import { Exception } from '../../src/utils/exception';
import { StatusCodes } from '../../src/utils/status-codes';

describe('Auth Service', () => {
  const url: string = AuthConfig.VerifyTokenUrl;
  const service: AuthService = new AuthService();

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('isTokenValid', () => {
    test('should return false when request return "401" status code', async () => {
      nock(url).get('/').reply(StatusCodes.Unauthorized);
      const result: boolean = await service.isTokenValid({ token: randomUUID() });
      expect(result).toBeFalsy();
    });

    test('should throw Exception when request return bad status code', async () => {
      nock(url).get('/').reply(StatusCodes.InternalServerError);
      let error: Exception;
      try {
        await service.isTokenValid({ token: randomUUID() });
      } catch (e) {
        error = e as Exception;
      }
      expect(error).toBeInstanceOf(Exception);
      expect(error.code).toBe(StatusCodes.InternalServerError);
    });

    test('should return true when request return valid status code', async () => {
      nock(url).get('/').reply(StatusCodes.Ok);
      const isValid: boolean = await service.isTokenValid({ token: randomUUID() });
      expect(isValid).toBeTruthy();
    });
  });
});
