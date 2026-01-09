import { Router } from 'express';
import { ControllersFactory } from '../../shared/factories/controllers.factory';

const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const controller = ControllersFactory.authenticateUserController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

export { authRouter };
