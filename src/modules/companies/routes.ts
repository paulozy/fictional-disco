import { Router } from 'express';
import { authMiddleware } from '../../infra/http/middlewares/auth.middleware';
import { ControllersFactory } from '../../shared/factories/controllers.factory';

const companiesRouter = Router();

companiesRouter.post('/register', async (req, res) => {
  const controller = ControllersFactory.registerCompanyController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

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
