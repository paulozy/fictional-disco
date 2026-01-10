import { Logger, LoggerFactory } from '../../../shared/logger';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { EmployeeInfo } from '../../shifts/entities/shift.entity';
import { SchedulesRepository } from '../repositories/schedules-repository.interface';

export interface GetScheduleByWeekRequest {
  weekStart: Date;
  companyId: string;
}

export interface ShiftInfo {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  employee: EmployeeInfo;
}

export interface GetScheduleByWeekResponse {
  schedule: {
    id: string;
    weekStart: Date;
    weekEnd: Date;
  };
  shifts: ShiftInfo[];
}

export class GetScheduleByWeekUseCase implements UseCase<GetScheduleByWeekRequest, GetScheduleByWeekResponse> {
  private logger: Logger;

  constructor(private schedulesRepository: SchedulesRepository) {
    this.logger = LoggerFactory.createLogger({
      module: 'Schedules',
      action: 'GetScheduleByWeek',
    });
  }

  async execute(request: GetScheduleByWeekRequest): Promise<GetScheduleByWeekResponse> {
    this.logger.info('Fetching schedule by week', {
      companyId: request.companyId,
      weekStart: request.weekStart.toISOString(),
    });

    try {
      let schedule = await this.schedulesRepository.findByWeekStart(request.weekStart, request.companyId);

      if (!schedule) {
        this.logger.info('Schedule not found, creating new one');
        schedule = await this.schedulesRepository.create({
          weekStart: request.weekStart,
          companyId: request.companyId,
        });
        this.logger.success('New schedule created', { scheduleId: schedule.id });
      }

      const weekEnd = new Date(request.weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const shifts = schedule.shifts || [];
      this.logger.info('Found shifts', { shiftCount: shifts.length, scheduleId: schedule.id });

      const shiftsWithEmployees = shifts.map((shift) => ({
        id: shift.id,
        dayOfWeek: shift.dayOfWeek,
        startTime: shift.startTime,
        endTime: shift.endTime,
        employee: {
          id: shift.employee!.id,
          name: shift.employee!.name,
          role: shift.employee!.role,
        },
      }));

      this.logger.success('Schedule retrieved successfully', {
        scheduleId: schedule.id,
        shiftCount: shiftsWithEmployees.length,
      });

      return {
        schedule: {
          id: schedule.id,
          weekStart: schedule.weekStart,
          weekEnd,
        },
        shifts: shiftsWithEmployees,
      };
    } catch (error) {
      this.logger.error('Failed to get schedule', error, { companyId: request.companyId });
      throw error;
    }
  }
}
