import { Router } from 'express';
import { ControllersFactory } from '../../shared/factories/controllers.factory';
import { authMiddleware } from '../../shared/http/auth.middleware';

const companiesRouter = Router();

companiesRouter.post('/', async (req, res) => {
  const controller = ControllersFactory.createCompanyController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

companiesRouter.get('/me', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.getMyCompanyController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

export { companiesRouter };
