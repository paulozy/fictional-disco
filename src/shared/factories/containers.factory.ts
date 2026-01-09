import { ControllersFactory } from './controllers.factory';

export class ContainersFactory {
  static getControllersFactory() {
    return {
      // Companies
      createCompanyController: () => ControllersFactory.createCompanyController(),
      getMyCompanyController: () => ControllersFactory.getMyCompanyController(),
      registerCompanyController: () => ControllersFactory.registerCompanyController(),

      // Users
      createUserController: () => ControllersFactory.createUserController(),
      getMeController: () => ControllersFactory.getMeController(),

      // Employees
      createEmployeeController: () => ControllersFactory.createEmployeeController(),
      listEmployeesController: () => ControllersFactory.listEmployeesController(),
      updateEmployeeController: () => ControllersFactory.updateEmployeeController(),
      deactivateEmployeeController: () => ControllersFactory.deactivateEmployeeController(),

      // Schedules
      createScheduleController: () => ControllersFactory.createScheduleController(),
      getScheduleByWeekController: () => ControllersFactory.getScheduleByWeekController(),
      autoGenerateScheduleController: () => ControllersFactory.autoGenerateScheduleController(),

      // Shifts
      createShiftController: () => ControllersFactory.createShiftController(),
      deleteShiftController: () => ControllersFactory.deleteShiftController(),

      // Auth
      authenticateUserController: () => ControllersFactory.authenticateUserController(),

      // Billing
      createCheckoutController: () => ControllersFactory.createCheckoutController(),
      webhookController: () => ControllersFactory.webhookController(),
      getSubscriptionStatusController: () => ControllersFactory.getSubscriptionStatusController(),
    };
  }
}

export const containersFactory = new ContainersFactory();
