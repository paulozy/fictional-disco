import { Router } from 'express';
import { authMiddleware } from '../../infra/http/middlewares/auth.middleware';
import { ControllersFactory } from '../../shared/factories/controllers.factory';

const schedulesRouter = Router();

schedulesRouter.post('/', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.createScheduleController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

schedulesRouter.get('/:weekStart', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.getScheduleByWeekController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

schedulesRouter.post('/:scheduleId/auto-generate', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.autoGenerateScheduleController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

export { schedulesRouter };
