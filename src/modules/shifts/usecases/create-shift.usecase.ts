import { UseCase } from '../../../shared/usecases/base-use-case';
import { ShiftsRepository } from '../repositories/shifts-repository.interface';

export interface CreateShiftRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  scheduleId: string;
  employeeId: string;
}

export interface CreateShiftResponse {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  scheduleId: string;
  employeeId: string;
  createdAt: Date;
}

export class CreateShiftUseCase implements UseCase<CreateShiftRequest, CreateShiftResponse> {
  constructor(private shiftsRepository: ShiftsRepository) { }

  async execute(request: CreateShiftRequest): Promise<CreateShiftResponse> {
    const shift = await this.shiftsRepository.create({
      dayOfWeek: request.dayOfWeek,
      startTime: request.startTime,
      endTime: request.endTime,
      scheduleId: request.scheduleId,
      employeeId: request.employeeId,
    });

    return {
      id: shift.id,
      dayOfWeek: shift.dayOfWeek,
      startTime: shift.startTime,
      endTime: shift.endTime,
      scheduleId: shift.scheduleId,
      employeeId: shift.employeeId,
      createdAt: shift.createdAt,
    };
  }
}
