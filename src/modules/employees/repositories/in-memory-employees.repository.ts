import { InMemoryRepository } from '../../../shared/testing/in-memory-repository';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeProps, EmployeesRepository, UpdateEmployeeProps } from '../repositories/employees-repository.interface';

export class InMemoryEmployeesRepository
  extends InMemoryRepository<Employee, CreateEmployeeProps, UpdateEmployeeProps>
  implements EmployeesRepository {
  async findByCompanyId(companyId: string): Promise<Employee[]> {
    const employees: Employee[] = [];
    for (const employee of this.entities.values()) {
      if (employee.companyId === companyId) {
        employees.push(employee);
      }
    }
    return employees;
  }

  async findActiveByCompanyId(companyId: string): Promise<Employee[]> {
    const employees: Employee[] = [];
    for (const employee of this.entities.values()) {
      if (employee.companyId === companyId && employee.active) {
        employees.push(employee);
      }
    }
    return employees;
  }

  async findByIds(ids: string[]): Promise<Employee[]> {
    const employees: Employee[] = [];
    const idSet = new Set(ids);
    for (const employee of this.entities.values()) {
      if (idSet.has(employee.id)) {
        employees.push(employee);
      }
    }
    return employees;
  }

  protected createEntity(props: CreateEmployeeProps): Employee {
    return Employee.create({
      name: props.name,
      role: props.role,
      phone: props.phone,
      active: props.active,
      workStartTime: props.workStartTime,
      workEndTime: props.workEndTime,
      workDays: props.workDays,
      companyId: props.companyId,
    });
  }

  protected updateEntity(entity: Employee, props: UpdateEmployeeProps): Employee {
    const updated = Employee.create({
      id: entity.id,
      name: props.name || entity.name,
      role: props.role || entity.role,
      phone: props.phone || entity.phone,
      active: props.active !== undefined ? props.active : entity.active,
      workStartTime: props.workStartTime || entity.workStartTime,
      workEndTime: props.workEndTime || entity.workEndTime,
      workDays: props.workDays || entity.workDays,
      companyId: entity.companyId,
      createdAt: entity.createdAt,
    });
    return updated;
  }

  protected getId(entity: Employee): string {
    return entity.id;
  }
}
