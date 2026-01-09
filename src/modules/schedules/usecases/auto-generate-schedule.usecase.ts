import { UseCase } from '../../../shared/usecases/base-use-case';
import { EmployeesRepository } from '../../employees/repositories/employees-repository.interface';
import { ShiftsRepository } from '../../shifts/repositories/shifts-repository.interface';
import { SchedulesRepository } from '../repositories/schedules-repository.interface';

export interface AutoGenerateScheduleRequest {
  scheduleId: string;
  employeeIds?: string[];
}

export interface AutoGenerateScheduleResponse {
  success: boolean;
  shiftsGenerated: number;
}

export class AutoGenerateScheduleUseCase
  implements UseCase<AutoGenerateScheduleRequest, AutoGenerateScheduleResponse> {
  constructor(
    private schedulesRepository: SchedulesRepository,
    private shiftsRepository: ShiftsRepository,
    private employeesRepository: EmployeesRepository,
  ) { }

  async execute(request: AutoGenerateScheduleRequest): Promise<AutoGenerateScheduleResponse> {
    const schedule = await this.schedulesRepository.findById(request.scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    let employees;
    if (request.employeeIds && request.employeeIds.length > 0) {
      employees = await this.employeesRepository.findByIds(request.employeeIds);
      if (employees.length !== request.employeeIds.length) {
        throw new Error('Some employees not found');
      }
    } else {
      employees = await this.employeesRepository.findActiveByCompanyId(schedule.companyId);
    }

    await this.shiftsRepository.deleteByScheduleId(request.scheduleId);

    let shiftsGenerated = 0;

    for (const employee of employees) {
      for (const dayOfWeek of employee.workDays) {
        await this.shiftsRepository.create({
          scheduleId: request.scheduleId,
          employeeId: employee.id,
          dayOfWeek,
          startTime: employee.workStartTime,
          endTime: employee.workEndTime,
        });
        shiftsGenerated++;
      }
    }

    return {
      success: true,
      shiftsGenerated,
    };
  }
}
