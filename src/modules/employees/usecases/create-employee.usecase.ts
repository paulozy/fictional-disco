import { UseCase } from '../../../shared/usecases/base-use-case';
import { EmployeesRepository } from '../repositories/employees-repository.interface';

export interface CreateEmployeeRequest {
  name: string;
  role: string;
  phone: string;
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  companyId: string;
}

export interface CreateEmployeeResponse {
  id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  companyId: string;
  createdAt: Date;
}

export class CreateEmployeeUseCase implements UseCase<CreateEmployeeRequest, CreateEmployeeResponse> {
  constructor(private employeesRepository: EmployeesRepository) { }

  async execute(request: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    const employee = await this.employeesRepository.create({
      name: request.name,
      role: request.role,
      phone: request.phone,
      active: true,
      workStartTime: request.workStartTime,
      workEndTime: request.workEndTime,
      workDays: request.workDays,
      companyId: request.companyId,
    });

    return {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      phone: employee.phone,
      active: employee.active,
      workStartTime: employee.workStartTime,
      workEndTime: employee.workEndTime,
      workDays: employee.workDays,
      companyId: employee.companyId,
      createdAt: employee.createdAt,
    };
  }
}
