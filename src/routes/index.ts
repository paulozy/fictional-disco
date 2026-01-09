import { Express } from 'express';
import { ControllersFactory } from '../shared/factories/controllers.factory';
import { authMiddleware, AuthRequest } from '../shared/http/auth.middleware';

export function setupRoutes(app: Express) {
  // Companies Routes
  app.post('/companies', async (req, res) => {
    const controller = ControllersFactory.createCompanyController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.get('/companies/me', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.getMyCompanyController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: {
        ...req.headers,
        companyId: req.user?.companyId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  // Users Routes
  app.post('/users', async (req, res) => {
    const controller = ControllersFactory.createUserController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.get('/users/me', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.getMeController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: {
        ...req.headers,
        userId: req.user?.userId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  // Auth Routes
  app.post('/auth/login', async (req, res) => {
    const controller = ControllersFactory.authenticateUserController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  // Employees Routes
  app.post('/employees', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.createEmployeeController();
    const httpResponse = await controller.handle({
      body: {
        ...req.body,
        companyId: req.user?.companyId,
      },
      params: req.params,
      headers: {
        ...req.headers,
        companyId: req.user?.companyId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.get('/employees', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.listEmployeesController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: {
        ...req.headers,
        companyId: req.user?.companyId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.put('/employees/:employeeId', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.updateEmployeeController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: {
        ...req.params,
        companyId: req.user?.companyId,
      },
      headers: {
        ...req.headers,
        companyId: req.user?.companyId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.patch('/employees/:employeeId/deactivate', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.deactivateEmployeeController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: {
        ...req.params,
        companyId: req.user?.companyId,
      },
      headers: {
        ...req.headers,
        companyId: req.user?.companyId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  // Schedules Routes
  app.post('/schedules', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.createScheduleController();
    const httpResponse = await controller.handle({
      body: {
        ...req.body,
        companyId: req.user?.companyId,
      },
      params: req.params,
      headers: {
        ...req.headers,
        companyId: req.user?.companyId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.get('/schedules/:weekStart', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.getScheduleByWeekController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: {
        ...req.params,
        companyId: req.user?.companyId,
      },
      headers: {
        ...req.headers,
        companyId: req.user?.companyId,
      },
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.post('/schedules/:scheduleId/auto-generate', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.autoGenerateScheduleController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  // Shifts Routes
  app.post('/shifts', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.createShiftController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });

  app.delete('/shifts/:shiftId', authMiddleware, async (req: AuthRequest, res) => {
    const controller = ControllersFactory.deleteShiftController();
    const httpResponse = await controller.handle({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });
    res.status(httpResponse.statusCode).json(httpResponse.body);
  });
}
