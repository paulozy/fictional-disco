import { UseCase } from '../../../shared/usecases/base-use-case';
import { EmployeesRepository } from '../repositories/employees-repository.interface';

export interface ListEmployeesRequest {
  companyId: string;
}

export interface ListEmployeesResponse {
  employees: Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    active: boolean;
    workStartTime: string;
    workEndTime: string;
    workDays: number[];
    createdAt: Date;
  }>;
}

export class ListEmployeesUseCase implements UseCase<ListEmployeesRequest, ListEmployeesResponse> {
  constructor(private employeesRepository: EmployeesRepository) { }

  async execute(request: ListEmployeesRequest): Promise<ListEmployeesResponse> {
    const employees = await this.employeesRepository.findByCompanyId(request.companyId);

    return {
      employees: employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
        phone: employee.phone,
        active: employee.active,
        workStartTime: employee.workStartTime,
        workEndTime: employee.workEndTime,
        workDays: employee.workDays,
        createdAt: employee.createdAt,
      })),
    };
  }
}
