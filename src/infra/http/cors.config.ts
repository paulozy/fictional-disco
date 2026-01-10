import { CorsOptions } from 'cors';
import { LoggerFactory } from '../../shared/logger';

const logger = LoggerFactory.createLogger({
  module: 'CORS',
  action: 'Configuration',
});

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Get CORS configuration based on environment
 * - Development: Allow all origins
 * - Production: Only allow specified frontend URL
 */
export function getCorsConfig(): CorsOptions {
  const allowedOrigins = getAllowedOrigins();

  logger.info('Setting up CORS configuration', {
    environment: process.env.NODE_ENV || 'development',
    isDevelopment,
    allowedOrigins: isDevelopment ? 'all' : allowedOrigins,
  });

  return {
    origin: isDevelopment ? '*' : allowedOrigins,
    credentials: !isDevelopment, // Only allow credentials in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    maxAge: 86400, // 24 hours
  };
}

/**
 * Get allowed origins for production environment
 */
function getAllowedOrigins(): string[] {
  const frontendUrl = process.env.FRONTEND_URL;
  const additionalUrls = process.env.ALLOWED_ORIGINS?.split(',') || [];

  if (!frontendUrl && additionalUrls.length === 0) {
    logger.warn('No FRONTEND_URL or ALLOWED_ORIGINS configured for production');
    return [];
  }

  const origins: string[] = [];

  if (frontendUrl) {
    origins.push(frontendUrl.trim());
    logger.info('Added FRONTEND_URL to allowed origins', { url: frontendUrl });
  }

  additionalUrls.forEach((url) => {
    const trimmedUrl = url.trim();
    if (trimmedUrl) {
      origins.push(trimmedUrl);
      logger.info('Added custom origin to allowed origins', { url: trimmedUrl });
    }
  });

  return origins;
}

/**
 * Validate if origin is allowed
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (isDevelopment) {
    return true;
  }

  if (!origin) {
    return false;
  }

  const allowedOrigins = getAllowedOrigins();
  const isAllowed = allowedOrigins.includes(origin);

  if (!isAllowed) {
    logger.warn('Origin not allowed', { origin });
  }

  return isAllowed;
}
