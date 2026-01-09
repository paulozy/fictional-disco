import { Request, Response, NextFunction } from 'express';
import { JwtTokenGenerator } from '../../shared/cryptography/jwt-token-generator';
import { TokenPayload } from '../../shared/cryptography/token-generator.interface';

const jwtTokenGenerator = new JwtTokenGenerator(process.env.JWT_SECRET || 'your-secret-key');

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer') {
      res.status(401).json({ error: 'Invalid authorization scheme' });
      return;
    }

    if (!token) {
      res.status(401).json({ error: 'Missing token' });
      return;
    }

    const payload = await jwtTokenGenerator.verify(token);
    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
