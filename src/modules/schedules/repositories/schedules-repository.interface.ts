import { Repository } from '../../../shared/repositories/repository.interface';
import { Schedule } from '../entities/schedule.entity';

export interface CreateScheduleProps {
  weekStart: Date;
  companyId: string;
}

export interface UpdateScheduleProps {
  weekStart?: Date;
}

export interface SchedulesRepository extends Repository<Schedule, CreateScheduleProps, UpdateScheduleProps> {
  findByCompanyId(companyId: string): Promise<Schedule[]>;
  findByWeekStart(weekStart: Date, companyId: string): Promise<Schedule | null>;
}
