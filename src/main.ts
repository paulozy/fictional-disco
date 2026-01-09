import express from 'express';
import { Database } from './database/database';
import { authRouter } from './modules/auth/routes';
import { companiesRouter } from './modules/companies/routes';
import { employeesRouter } from './modules/employees/routes';
import { schedulesRouter } from './modules/schedules/routes';
import { shiftsRouter } from './modules/shifts/routes';
import { usersRouter } from './modules/users/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/companies', companiesRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/employees', employeesRouter);
app.use('/schedules', schedulesRouter);
app.use('/shifts', shiftsRouter);

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
