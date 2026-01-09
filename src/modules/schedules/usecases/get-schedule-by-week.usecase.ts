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
  constructor(private schedulesRepository: SchedulesRepository) { }

  async execute(request: GetScheduleByWeekRequest): Promise<GetScheduleByWeekResponse> {
    let schedule = await this.schedulesRepository.findByWeekStart(request.weekStart, request.companyId);

    if (!schedule) {
      schedule = await this.schedulesRepository.create({
        weekStart: request.weekStart,
        companyId: request.companyId,
      });
    }

    const weekEnd = new Date(request.weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const shifts = schedule.shifts || [];
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

    return {
      schedule: {
        id: schedule.id,
        weekStart: schedule.weekStart,
        weekEnd,
      },
      shifts: shiftsWithEmployees,
    };
  }
}
