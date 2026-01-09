import { BcryptEncrypter } from '../cryptography/bcrypt-encrypter';
import { JwtTokenGenerator } from '../cryptography/jwt-token-generator';
import { RepositoriesFactory } from './repositories.factory';

// Companies
import { CreateCompanyUseCase } from '../../modules/companies/usecases/create-company.usecase';
import { GetMyCompanyUseCase } from '../../modules/companies/usecases/get-my-company.usecase';
import { RegisterCompanyUseCase } from '../../modules/companies/usecases/register-company.usecase';

// Users
import { CreateUserUseCase } from '../../modules/users/usecases/create-user.usecase';
import { GetMeUseCase } from '../../modules/users/usecases/get-me.usecase';

// Employees
import { CreateEmployeeUseCase } from '../../modules/employees/usecases/create-employee.usecase';
import { DeactivateEmployeeUseCase } from '../../modules/employees/usecases/deactivate-employee.usecase';
import { ListEmployeesUseCase } from '../../modules/employees/usecases/list-employees.usecase';
import { UpdateEmployeeUseCase } from '../../modules/employees/usecases/update-employee.usecase';

// Schedules
import { AutoGenerateScheduleUseCase } from '../../modules/schedules/usecases/auto-generate-schedule.usecase';
import { CreateScheduleUseCase } from '../../modules/schedules/usecases/create-schedule.usecase';
import { GetScheduleByWeekUseCase } from '../../modules/schedules/usecases/get-schedule-by-week.usecase';

// Shifts
import { CreateShiftUseCase } from '../../modules/shifts/usecases/create-shift.usecase';
import { DeleteShiftUseCase } from '../../modules/shifts/usecases/delete-shift.usecase';

// Auth
import { AuthenticateUserUseCase } from '../../modules/auth/usecases/authenticate-user.usecase';

// Billing
import { CreateCheckoutUseCase } from '../../modules/billing/usecases/create-checkout.usecase';
import { GetSubscriptionStatusUseCase } from '../../modules/billing/usecases/get-subscription-status.usecase';
import { HandleWebhookUseCase } from '../../modules/billing/usecases/handle-webhook.usecase';

const bcryptEncrypter = new BcryptEncrypter();
const jwtTokenGenerator = new JwtTokenGenerator();

export class UseCasesFactory {
  // Companies
  static createCompanyUseCase(): CreateCompanyUseCase {
    return new CreateCompanyUseCase(RepositoriesFactory.getCompaniesRepository());
  }

  static getMyCompanyUseCase(): GetMyCompanyUseCase {
    return new GetMyCompanyUseCase(RepositoriesFactory.getCompaniesRepository());
  }

  static registerCompanyUseCase(): RegisterCompanyUseCase {
    return new RegisterCompanyUseCase(
      RepositoriesFactory.getCompaniesRepository(),
      RepositoriesFactory.getUsersRepository(),
      bcryptEncrypter,
      jwtTokenGenerator,
    );
  }

  // Users
  static createUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(
      RepositoriesFactory.getUsersRepository(),
      bcryptEncrypter,
    );
  }

  static getMeUseCase(): GetMeUseCase {
    return new GetMeUseCase(RepositoriesFactory.getUsersRepository());
  }

  // Employees
  static createEmployeeUseCase(): CreateEmployeeUseCase {
    return new CreateEmployeeUseCase(
      RepositoriesFactory.getEmployeesRepository(),
    );
  }

  static listEmployeesUseCase(): ListEmployeesUseCase {
    return new ListEmployeesUseCase(
      RepositoriesFactory.getEmployeesRepository(),
    );
  }

  static updateEmployeeUseCase(): UpdateEmployeeUseCase {
    return new UpdateEmployeeUseCase(
      RepositoriesFactory.getEmployeesRepository(),
    );
  }

  static deactivateEmployeeUseCase(): DeactivateEmployeeUseCase {
    return new DeactivateEmployeeUseCase(
      RepositoriesFactory.getEmployeesRepository(),
    );
  }

  // Schedules
  static createScheduleUseCase(): CreateScheduleUseCase {
    return new CreateScheduleUseCase(
      RepositoriesFactory.getSchedulesRepository(),
    );
  }

  static getScheduleByWeekUseCase(): GetScheduleByWeekUseCase {
    return new GetScheduleByWeekUseCase(
      RepositoriesFactory.getSchedulesRepository(),
    );
  }

  static autoGenerateScheduleUseCase(): AutoGenerateScheduleUseCase {
    return new AutoGenerateScheduleUseCase(
      RepositoriesFactory.getSchedulesRepository(),
      RepositoriesFactory.getShiftsRepository(),
      RepositoriesFactory.getEmployeesRepository(),
    );
  }

  // Shifts
  static createShiftUseCase(): CreateShiftUseCase {
    return new CreateShiftUseCase(
      RepositoriesFactory.getShiftsRepository(),
    );
  }

  static deleteShiftUseCase(): DeleteShiftUseCase {
    return new DeleteShiftUseCase(RepositoriesFactory.getShiftsRepository());
  }

  // Auth
  static authenticateUserUseCase(): AuthenticateUserUseCase {
    return new AuthenticateUserUseCase(
      RepositoriesFactory.getUsersRepository(),
      bcryptEncrypter,
      jwtTokenGenerator,
    );
  }

  // Billing
  static createCheckoutUseCase(): CreateCheckoutUseCase {
    return new CreateCheckoutUseCase(
      RepositoriesFactory.getSubscriptionsRepository(),
    );
  }

  static handleWebhookUseCase(): HandleWebhookUseCase {
    return new HandleWebhookUseCase(
      RepositoriesFactory.getSubscriptionsRepository(),
    );
  }

  static getSubscriptionStatusUseCase(): GetSubscriptionStatusUseCase {
    return new GetSubscriptionStatusUseCase(
      RepositoriesFactory.getSubscriptionsRepository(),
    );
  }
}
