import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { TokenGenerator, TokenPayload } from '../cryptography/token-generator.interface';

export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly secret: string, private readonly expiresIn: string = '24h') { }

  async generate(payload: TokenPayload): Promise<string> {
    const options: SignOptions = {
      expiresIn: this.expiresIn,
      algorithm: 'HS256',
    };

    return jwt.sign(payload, this.secret, options);
  }

  async verify(token: string): Promise<TokenPayload> {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
      };

      const decoded = jwt.verify(token, this.secret, options);

      return decoded as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
