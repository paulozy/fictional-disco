import 'dotenv/config';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { TokenGenerator, TokenPayload } from '../cryptography/token-generator.interface';

export class JwtTokenGenerator implements TokenGenerator {
  private readonly secret: string;

  constructor(private readonly expiresIn: string = '1d') {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    this.secret = secret;
  }

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
      console.log("🚀 ~ JwtTokenGenerator ~ verify ~ error:", error)
      throw new Error('Invalid or expired token');
    }
  }
}
