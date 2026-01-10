import { Logger, LoggerFactory } from '../../../shared/logger';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { SchedulesRepository } from '../repositories/schedules-repository.interface';

export interface CreateScheduleRequest {
  weekStart: Date;
  companyId: string;
}

export interface CreateScheduleResponse {
  id: string;
  weekStart: Date;
  companyId: string;
  createdAt: Date;
}

export class CreateScheduleUseCase implements UseCase<CreateScheduleRequest, CreateScheduleResponse> {
  private logger: Logger;

  constructor(private schedulesRepository: SchedulesRepository) {
    this.logger = LoggerFactory.createLogger({
      module: 'Schedules',
      action: 'CreateSchedule',
    });
  }

  async execute(request: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    this.logger.info('Creating new schedule', {
      companyId: request.companyId,
      weekStart: request.weekStart.toISOString(),
    });

    try {
      const schedule = await this.schedulesRepository.create({
        weekStart: request.weekStart,
        companyId: request.companyId,
      });

      this.logger.success('Schedule created successfully', {
        scheduleId: schedule.id,
        weekStart: schedule.weekStart.toISOString(),
      });

      return {
        id: schedule.id,
        weekStart: schedule.weekStart,
        companyId: schedule.companyId,
        createdAt: schedule.createdAt,
      };
    } catch (error) {
      this.logger.error('Failed to create schedule', error, { companyId: request.companyId });
      throw error;
    }
  }
}
