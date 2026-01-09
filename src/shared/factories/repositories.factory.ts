import { Database } from '../../infra/database/database';
import { CompaniesPrismaRepository } from '../../modules/companies/repositories/companies-prisma.repository';
import { EmployeesPrismaRepository } from '../../modules/employees/repositories/employees-prisma.repository';
import { SchedulesPrismaRepository } from '../../modules/schedules/repositories/schedules-prisma.repository';
import { ShiftsPrismaRepository } from '../../modules/shifts/repositories/shifts-prisma.repository';
import { UsersPrismaRepository } from '../../modules/users/repositories/users-prisma.repository';

export class RepositoriesFactory {
  static getCompaniesRepository() {
    return new CompaniesPrismaRepository(Database.getInstance());
  }

  static getUsersRepository() {
    return new UsersPrismaRepository(Database.getInstance());
  }

  static getEmployeesRepository() {
    return new EmployeesPrismaRepository(Database.getInstance());
  }

  static getSchedulesRepository() {
    return new SchedulesPrismaRepository(Database.getInstance());
  }

  static getShiftsRepository() {
    return new ShiftsPrismaRepository(Database.getInstance());
  }

  static async disconnect(): Promise<void> {
    await Database.disconnect();
  }
}
