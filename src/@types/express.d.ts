import 'express';
import { TokenPayload } from '../shared/cryptography/token-generator.interface';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
