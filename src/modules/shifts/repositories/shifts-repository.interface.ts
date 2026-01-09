import { Repository } from '../../../shared/repositories/repository.interface';
import { Shift } from '../entities/shift.entity';

export interface CreateShiftProps {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  scheduleId: string;
  employeeId: string;
}

export interface UpdateShiftProps {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

export interface ShiftsRepository extends Repository<Shift, CreateShiftProps, UpdateShiftProps> {
  findByScheduleId(scheduleId: string): Promise<Shift[]>;
  findByEmployeeIdAndScheduleId(employeeId: string, scheduleId: string): Promise<Shift[]>;
  findByScheduleIdAndDayOfWeek(scheduleId: string, dayOfWeek: number): Promise<Shift[]>;
  deleteByScheduleId(scheduleId: string): Promise<void>;
}
