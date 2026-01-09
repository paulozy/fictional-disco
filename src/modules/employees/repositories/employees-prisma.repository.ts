import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '../../../shared/repositories/prisma-repository';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeProps, EmployeesRepository, UpdateEmployeeProps } from './employees-repository.interface';

export class EmployeesPrismaRepository
  extends PrismaRepository<Employee, CreateEmployeeProps, UpdateEmployeeProps>
  implements EmployeesRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(props: CreateEmployeeProps): Promise<Employee> {
    const employee = await this.prisma.employee.create({
      data: {
        name: props.name,
        role: props.role,
        phone: props.phone,
        active: props.active,
        workStartTime: props.workStartTime,
        workEndTime: props.workEndTime,
        workDays: props.workDays,
        companyId: props.companyId,
      },
    });

    return this.toDomain(employee);
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    return employee ? this.toDomain(employee) : null;
  }

  async findByCompanyId(companyId: string): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      where: { companyId },
    });

    return employees.map((emp) => this.toDomain(emp));
  }

  async findActiveByCompanyId(companyId: string): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      where: { companyId, active: true },
    });

    return employees.map((emp) => this.toDomain(emp));
  }

  async findByIds(ids: string[]): Promise<Employee[]> {
    const employees = await this.prisma.employee.findMany({
      where: { id: { in: ids } },
    });

    return employees.map((emp) => this.toDomain(emp));
  }

  async update(id: string, props: UpdateEmployeeProps): Promise<Employee> {
    const employee = await this.prisma.employee.update({
      where: { id },
      data: {
        name: props.name,
        role: props.role,
        phone: props.phone,
        active: props.active,
        workStartTime: props.workStartTime,
        workEndTime: props.workEndTime,
        workDays: props.workDays,
      },
    });

    return this.toDomain(employee);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employee.delete({
      where: { id },
    });
  }

  protected toDomain(raw: any): Employee {
    return Employee.create({
      id: raw.id,
      name: raw.name,
      role: raw.role,
      phone: raw.phone,
      active: raw.active,
      workStartTime: raw.workStartTime,
      workEndTime: raw.workEndTime,
      workDays: raw.workDays,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
    });
  }

  protected toPersistence(entity: Employee): any {
    return {
      id: entity.id,
      name: entity.name,
      role: entity.role,
      phone: entity.phone,
      active: entity.active,
      workStartTime: entity.workStartTime,
      workEndTime: entity.workEndTime,
      workDays: entity.workDays,
      companyId: entity.companyId,
      createdAt: entity.createdAt,
    };
  }
}
