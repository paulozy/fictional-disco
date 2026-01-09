import { PrismaClient } from '@prisma/client';
import { CompaniesPrismaRepository } from '../modules/companies/repositories/companies-prisma.repository';
import { EmployeesPrismaRepository } from '../modules/employees/repositories/employees-prisma.repository';
import { SchedulesPrismaRepository } from '../modules/schedules/repositories/schedules-prisma.repository';
import { ShiftsPrismaRepository } from '../modules/shifts/repositories/shifts-prisma.repository';
import { UsersPrismaRepository } from '../modules/users/repositories/users-prisma.repository';

export class RepositoriesFactory {
  private static prisma: PrismaClient | null = null;

  static getPrismaClient(): PrismaClient {
    if (!this.prisma) {
      this.prisma = new PrismaClient();
    }
    return this.prisma;
  }

  static getCompaniesRepository() {
    return new CompaniesPrismaRepository(this.getPrismaClient());
  }

  static getUsersRepository() {
    return new UsersPrismaRepository(this.getPrismaClient());
  }

  static getEmployeesRepository() {
    return new EmployeesPrismaRepository(this.getPrismaClient());
  }

  static getSchedulesRepository() {
    return new SchedulesPrismaRepository(this.getPrismaClient());
  }

  static getShiftsRepository() {
    return new ShiftsPrismaRepository(this.getPrismaClient());
  }

  static async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
    }
  }
}
