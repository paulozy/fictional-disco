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
  constructor(private schedulesRepository: SchedulesRepository) { }

  async execute(request: CreateScheduleRequest): Promise<CreateScheduleResponse> {
    const schedule = await this.schedulesRepository.create({
      weekStart: request.weekStart,
      companyId: request.companyId,
    });

    return {
      id: schedule.id,
      weekStart: schedule.weekStart,
      companyId: schedule.companyId,
      createdAt: schedule.createdAt,
    };
  }
}
