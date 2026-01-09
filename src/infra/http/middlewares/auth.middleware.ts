import { NextFunction, Request, Response } from 'express';
import { JwtTokenGenerator } from '../../../shared/cryptography/jwt-token-generator';

const jwtTokenGenerator = new JwtTokenGenerator();

export async function authMiddleware(
  req: Request,
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
