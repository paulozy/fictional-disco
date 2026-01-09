import { UseCasesFactory } from './usecases.factory';

// Companies
import { CreateCompanyController } from '../../modules/companies/controllers/create-company.controller';
import { GetMyCompanyController } from '../../modules/companies/controllers/get-my-company.controller';
import { RegisterCompanyController } from '../../modules/companies/controllers/register-company.controller';

// Users
import { CreateUserController } from '../../modules/users/controllers/create-user.controller';
import { GetMeController } from '../../modules/users/controllers/get-me.controller';

// Employees
import { CreateEmployeeController } from '../../modules/employees/controllers/create-employee.controller';
import { DeactivateEmployeeController } from '../../modules/employees/controllers/deactivate-employee.controller';
import { ListEmployeesController } from '../../modules/employees/controllers/list-employees.controller';
import { UpdateEmployeeController } from '../../modules/employees/controllers/update-employee.controller';

// Schedules
import { AutoGenerateScheduleController } from '../../modules/schedules/controllers/auto-generate-schedule.controller';
import { CreateScheduleController } from '../../modules/schedules/controllers/create-schedule.controller';
import { GetScheduleByWeekController } from '../../modules/schedules/controllers/get-schedule-by-week.controller';

// Shifts
import { CreateShiftController } from '../../modules/shifts/controllers/create-shift.controller';
import { DeleteShiftController } from '../../modules/shifts/controllers/delete-shift.controller';

// Auth
import { AuthenticateUserController } from '../../modules/auth/controllers/authenticate-user.controller';

export class ControllersFactory {
  // Companies
  static createCompanyController(): CreateCompanyController {
    return new CreateCompanyController(UseCasesFactory.createCompanyUseCase());
  }

  static getMyCompanyController(): GetMyCompanyController {
    return new GetMyCompanyController(UseCasesFactory.getMyCompanyUseCase());
  }

  static registerCompanyController(): RegisterCompanyController {
    return new RegisterCompanyController(UseCasesFactory.registerCompanyUseCase());
  }

  // Users
  static createUserController(): CreateUserController {
    return new CreateUserController(UseCasesFactory.createUserUseCase());
  }

  static getMeController(): GetMeController {
    return new GetMeController(UseCasesFactory.getMeUseCase());
  }

  // Employees
  static createEmployeeController(): CreateEmployeeController {
    return new CreateEmployeeController(UseCasesFactory.createEmployeeUseCase());
  }

  static listEmployeesController(): ListEmployeesController {
    return new ListEmployeesController(UseCasesFactory.listEmployeesUseCase());
  }

  static updateEmployeeController(): UpdateEmployeeController {
    return new UpdateEmployeeController(UseCasesFactory.updateEmployeeUseCase());
  }

  static deactivateEmployeeController(): DeactivateEmployeeController {
    return new DeactivateEmployeeController(
      UseCasesFactory.deactivateEmployeeUseCase(),
    );
  }

  // Schedules
  static createScheduleController(): CreateScheduleController {
    return new CreateScheduleController(UseCasesFactory.createScheduleUseCase());
  }

  static getScheduleByWeekController(): GetScheduleByWeekController {
    return new GetScheduleByWeekController(
      UseCasesFactory.getScheduleByWeekUseCase(),
    );
  }

  static autoGenerateScheduleController(): AutoGenerateScheduleController {
    return new AutoGenerateScheduleController(
      UseCasesFactory.autoGenerateScheduleUseCase(),
    );
  }

  // Shifts
  static createShiftController(): CreateShiftController {
    return new CreateShiftController(UseCasesFactory.createShiftUseCase());
  }

  static deleteShiftController(): DeleteShiftController {
    return new DeleteShiftController(UseCasesFactory.deleteShiftUseCase());
  }

  // Auth
  static authenticateUserController(): AuthenticateUserController {
    return new AuthenticateUserController(
      UseCasesFactory.authenticateUserUseCase(),
    );
  }
}
