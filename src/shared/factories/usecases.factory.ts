import { RepositoriesFactory } from './repositories.factory';
import { BcryptEncrypter } from '../cryptography/bcrypt-encrypter';
import { JwtTokenGenerator } from '../cryptography/jwt-token-generator';

// Companies
import { CreateCompanyUseCase } from '../../modules/companies/usecases/create-company.usecase';
import { GetMyCompanyUseCase } from '../../modules/companies/usecases/get-my-company.usecase';

// Users
import { CreateUserUseCase } from '../../modules/users/usecases/create-user.usecase';
import { GetMeUseCase } from '../../modules/users/usecases/get-me.usecase';

// Employees
import { CreateEmployeeUseCase } from '../../modules/employees/usecases/create-employee.usecase';
import { ListEmployeesUseCase } from '../../modules/employees/usecases/list-employees.usecase';
import { UpdateEmployeeUseCase } from '../../modules/employees/usecases/update-employee.usecase';
import { DeactivateEmployeeUseCase } from '../../modules/employees/usecases/deactivate-employee.usecase';

// Schedules
import { CreateScheduleUseCase } from '../../modules/schedules/usecases/create-schedule.usecase';
import { GetScheduleByWeekUseCase } from '../../modules/schedules/usecases/get-schedule-by-week.usecase';
import { AutoGenerateScheduleUseCase } from '../../modules/schedules/usecases/auto-generate-schedule.usecase';

// Shifts
import { CreateShiftUseCase } from '../../modules/shifts/usecases/create-shift.usecase';
import { DeleteShiftUseCase } from '../../modules/shifts/usecases/delete-shift.usecase';

// Auth
import { AuthenticateUserUseCase } from '../../modules/auth/usecases/authenticate-user.usecase';

const bcryptEncrypter = new BcryptEncrypter();
const jwtTokenGenerator = new JwtTokenGenerator(process.env.JWT_SECRET || 'your-secret-key');

export class UseCasesFactory {
  // Companies
  static createCompanyUseCase(): CreateCompanyUseCase {
    return new CreateCompanyUseCase(RepositoriesFactory.getCompaniesRepository());
  }

  static getMyCompanyUseCase(): GetMyCompanyUseCase {
    return new GetMyCompanyUseCase(RepositoriesFactory.getCompaniesRepository());
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
      RepositoriesFactory.getCompaniesRepository(),
    );
  }

  static listEmployeesUseCase(): ListEmployeesUseCase {
    return new ListEmployeesUseCase(
      RepositoriesFactory.getEmployeesRepository(),
      RepositoriesFactory.getCompaniesRepository(),
    );
  }

  static updateEmployeeUseCase(): UpdateEmployeeUseCase {
    return new UpdateEmployeeUseCase(
      RepositoriesFactory.getEmployeesRepository(),
      RepositoriesFactory.getCompaniesRepository(),
    );
  }

  static deactivateEmployeeUseCase(): DeactivateEmployeeUseCase {
    return new DeactivateEmployeeUseCase(
      RepositoriesFactory.getEmployeesRepository(),
      RepositoriesFactory.getCompaniesRepository(),
    );
  }

  // Schedules
  static createScheduleUseCase(): CreateScheduleUseCase {
    return new CreateScheduleUseCase(
      RepositoriesFactory.getSchedulesRepository(),
      RepositoriesFactory.getCompaniesRepository(),
    );
  }

  static getScheduleByWeekUseCase(): GetScheduleByWeekUseCase {
    return new GetScheduleByWeekUseCase(
      RepositoriesFactory.getSchedulesRepository(),
      RepositoriesFactory.getCompaniesRepository(),
    );
  }

  static autoGenerateScheduleUseCase(): AutoGenerateScheduleUseCase {
    return new AutoGenerateScheduleUseCase(
      RepositoriesFactory.getSchedulesRepository(),
      RepositoriesFactory.getEmployeesRepository(),
      RepositoriesFactory.getShiftsRepository(),
    );
  }

  // Shifts
  static createShiftUseCase(): CreateShiftUseCase {
    return new CreateShiftUseCase(
      RepositoriesFactory.getShiftsRepository(),
      RepositoriesFactory.getSchedulesRepository(),
      RepositoriesFactory.getEmployeesRepository(),
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
}
