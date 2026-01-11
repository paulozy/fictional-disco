import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { Database } from './infra/database/database';
import { getCorsConfig } from './infra/http/cors.config';
import { setupRoutes } from './infra/http/routes';
import { ControllersFactory } from './shared/factories/controllers.factory';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(cors(getCorsConfig()));

app.post(
  '/billing/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => ControllersFactory.webhookController().handle(req, res)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Setup routes
setupRoutes(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await Database.disconnect();
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(async () => {
    await Database.disconnect();
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
