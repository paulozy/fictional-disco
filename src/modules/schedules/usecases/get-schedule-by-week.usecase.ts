import { UseCase } from '../../../shared/usecases/base-use-case';
import { SchedulesRepository } from '../repositories/schedules-repository.interface';

export interface GetScheduleByWeekRequest {
  weekStart: Date;
  companyId: string;
}

export interface GetScheduleByWeekResponse {
  id: string;
  weekStart: Date;
  companyId: string;
  createdAt: Date;
}

export class GetScheduleByWeekUseCase implements UseCase<GetScheduleByWeekRequest, GetScheduleByWeekResponse> {
  constructor(private schedulesRepository: SchedulesRepository) { }

  async execute(request: GetScheduleByWeekRequest): Promise<GetScheduleByWeekResponse> {
    const schedule = await this.schedulesRepository.findByWeekStart(request.weekStart, request.companyId);

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    return {
      id: schedule.id,
      weekStart: schedule.weekStart,
      companyId: schedule.companyId,
      createdAt: schedule.createdAt,
    };
  }
}
