import { Router } from 'express';
import { authMiddleware } from '../../infra/http/middlewares/auth.middleware';
import { ControllersFactory } from '../../shared/factories/controllers.factory';

const employeesRouter = Router();

employeesRouter.post('/', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.createEmployeeController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

employeesRouter.get('/', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.listEmployeesController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

employeesRouter.put('/:employeeId', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.updateEmployeeController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

employeesRouter.patch('/:employeeId/deactivate', authMiddleware, async (req, res) => {
  const controller = ControllersFactory.deactivateEmployeeController();
  const httpResponse = await controller.handle(req);
  res.status(httpResponse.statusCode).json(httpResponse.body);
});

export { employeesRouter };
