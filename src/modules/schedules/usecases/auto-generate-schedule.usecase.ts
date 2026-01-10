import { Logger, LoggerFactory } from '../../../shared/logger';
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
  private logger: Logger;

  constructor(
    private schedulesRepository: SchedulesRepository,
    private shiftsRepository: ShiftsRepository,
    private employeesRepository: EmployeesRepository,
  ) {
    this.logger = LoggerFactory.createLogger({
      module: 'Schedules',
      action: 'AutoGenerateSchedule',
    });
  }

  async execute(request: AutoGenerateScheduleRequest): Promise<AutoGenerateScheduleResponse> {
    this.logger.info('Starting auto-generate schedule', {
      scheduleId: request.scheduleId,
      specificEmployees: request.employeeIds?.length || 0,
    });

    try {
      const schedule = await this.schedulesRepository.findById(request.scheduleId);
      if (!schedule) {
        this.logger.error('Schedule not found', new Error('Schedule not found'), {
          scheduleId: request.scheduleId,
        });
        throw new Error('Schedule not found');
      }

      this.logger.info('Schedule found, fetching employees', { scheduleId: request.scheduleId });

      let employees;
      if (request.employeeIds && request.employeeIds.length > 0) {
        this.logger.info('Fetching specific employees', { employeeCount: request.employeeIds.length });
        employees = await this.employeesRepository.findByIds(request.employeeIds);
        if (employees.length !== request.employeeIds.length) {
          this.logger.error('Some employees not found', new Error('Some employees not found'), {
            scheduleId: request.scheduleId,
          });
          throw new Error('Some employees not found');
        }
      } else {
        this.logger.info('Fetching all active employees', { companyId: schedule.companyId });
        employees = await this.employeesRepository.findActiveByCompanyId(schedule.companyId);
      }

      this.logger.info('Found employees, clearing previous shifts', {
        employeeCount: employees.length,
        scheduleId: request.scheduleId,
      });

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

      this.logger.success('Schedule auto-generated successfully', {
        scheduleId: request.scheduleId,
        shiftsGenerated,
        employeeCount: employees.length,
      });

      return {
        success: true,
        shiftsGenerated,
      };
    } catch (error) {
      this.logger.error('Failed to auto-generate schedule', error, {
        scheduleId: request.scheduleId,
      });
      throw error;
    }
  }
}
