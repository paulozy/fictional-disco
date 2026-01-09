import { Router } from 'express';
import { ControllersFactory } from '../../shared/factories/controllers.factory';
import { authMiddleware } from '../../shared/http/auth.middleware';

const usersRouter = Router();

usersRouter.post('/', async (req, res) => {
  const controller = ControllersFactory.createUserController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

usersRouter.get('/me', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.getMeController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

export { usersRouter };
