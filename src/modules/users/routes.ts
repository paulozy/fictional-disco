import { Router } from 'express';
import { authMiddleware } from '../../infra/http/middlewares/auth.middleware';
import { ControllersFactory } from '../../shared/factories/controllers.factory';

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
