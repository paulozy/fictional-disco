import { Express } from 'express';
import { authRouter } from '../../../modules/auth/routes';
import { billingRoutes } from '../../../modules/billing/routes';
import { companiesRouter } from '../../../modules/companies/routes';
import { employeesRouter } from '../../../modules/employees/routes';
import { schedulesRouter } from '../../../modules/schedules/routes';
import { shiftsRouter } from '../../../modules/shifts/routes';
import { usersRouter } from '../../../modules/users/routes';

export function setupRoutes(app: Express) {
  app.use('/companies', companiesRouter);
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/employees', employeesRouter);
  app.use('/schedules', schedulesRouter);
  app.use('/shifts', shiftsRouter);
  app.use('/billing', billingRoutes);
}
