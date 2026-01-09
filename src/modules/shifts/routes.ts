import { Router } from 'express';
import { authMiddleware } from '../../infra/http/middlewares/auth.middleware';
import { ControllersFactory } from '../../shared/factories/controllers.factory';

const shiftsRouter = Router();

shiftsRouter.post('/', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.createShiftController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

shiftsRouter.delete('/:shiftId', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.deleteShiftController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

export { shiftsRouter };
