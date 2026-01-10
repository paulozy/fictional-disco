import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to capture raw body for webhook signature verification.
 * Must be applied before express.json() for webhook routes.
 */
export function webhookRawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.path.includes('/webhook')) {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      (req as any).rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
}
