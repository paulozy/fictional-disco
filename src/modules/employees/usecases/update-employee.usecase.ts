import { UseCase } from '../../../shared/usecases/base-use-case';
import { EmployeesRepository } from '../repositories/employees-repository.interface';

export interface UpdateEmployeeRequest {
  employeeId: string;
  name?: string;
  role?: string;
  phone?: string;
  workStartTime?: string;
  workEndTime?: string;
  workDays?: number[];
}

export interface UpdateEmployeeResponse {
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

export class UpdateEmployeeUseCase implements UseCase<UpdateEmployeeRequest, UpdateEmployeeResponse> {
  constructor(private employeesRepository: EmployeesRepository) { }

  async execute(request: UpdateEmployeeRequest): Promise<UpdateEmployeeResponse> {
    const employee = await this.employeesRepository.update(request.employeeId, {
      name: request.name,
      role: request.role,
      phone: request.phone,
      workStartTime: request.workStartTime,
      workEndTime: request.workEndTime,
      workDays: request.workDays,
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
