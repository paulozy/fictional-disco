import { Router } from 'express';
import { ControllersFactory } from '../../shared/factories/controllers.factory';
import { authMiddleware } from '../../shared/http/auth.middleware';

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
