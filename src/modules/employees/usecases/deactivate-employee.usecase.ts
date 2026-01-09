import { UseCase } from '../../../shared/usecases/base-use-case';
import { EmployeesRepository } from '../repositories/employees-repository.interface';

export interface DeactivateEmployeeRequest {
  employeeId: string;
}

export interface DeactivateEmployeeResponse {
  id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
  workStartTime: string;
  workEndTime: string;
  workDays: number[];
  createdAt: Date;
}

export class DeactivateEmployeeUseCase implements UseCase<DeactivateEmployeeRequest, DeactivateEmployeeResponse> {
  constructor(private employeesRepository: EmployeesRepository) { }

  async execute(request: DeactivateEmployeeRequest): Promise<DeactivateEmployeeResponse> {
    const employee = await this.employeesRepository.update(request.employeeId, {
      active: false,
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
      createdAt: employee.createdAt,
    };
  }
}
