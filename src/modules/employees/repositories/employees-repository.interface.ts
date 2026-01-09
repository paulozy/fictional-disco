import { Repository } from '../../../shared/repositories/repository.interface';
import { Employee } from '../entities/employee.entity';

export interface CreateEmployeeProps {
  name: string;
  role: string;
  phone: string;
  active: boolean;
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  companyId: string;
}

export interface UpdateEmployeeProps {
  name?: string;
  role?: string;
  phone?: string;
  active?: boolean;
  workStartTime?: string;
  workEndTime?: string;
  workDays?: number[];
}

export interface EmployeesRepository extends Repository<Employee, CreateEmployeeProps, UpdateEmployeeProps> {
  findByCompanyId(companyId: string): Promise<Employee[]>;
  findActiveByCompanyId(companyId: string): Promise<Employee[]>;
  findByIds(ids: string[]): Promise<Employee[]>;
}
