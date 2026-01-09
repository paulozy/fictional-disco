import { InMemoryRepository } from '../../../shared/testing/in-memory-repository';
import { Schedule } from '../entities/schedule.entity';
import { CreateScheduleProps, SchedulesRepository, UpdateScheduleProps } from '../repositories/schedules-repository.interface';

export class InMemorySchedulesRepository
  extends InMemoryRepository<Schedule, CreateScheduleProps, UpdateScheduleProps>
  implements SchedulesRepository {
  async findByCompanyId(companyId: string): Promise<Schedule[]> {
    const schedules: Schedule[] = [];
    for (const schedule of this.entities.values()) {
      if (schedule.companyId === companyId) {
        schedules.push(schedule);
      }
    }
    return schedules;
  }

  async findByWeekStart(weekStart: Date, companyId: string): Promise<Schedule | null> {
    for (const schedule of this.entities.values()) {
      if (
        schedule.companyId === companyId &&
        schedule.weekStart.getTime() === weekStart.getTime()
      ) {
        return schedule;
      }
    }
    return null;
  }

  protected createEntity(props: CreateScheduleProps): Schedule {
    return Schedule.create({
      weekStart: props.weekStart,
      companyId: props.companyId,
    });
  }

  protected updateEntity(entity: Schedule, props: UpdateScheduleProps): Schedule {
    const updated = Schedule.create({
      id: entity.id,
      weekStart: props.weekStart || entity.weekStart,
      companyId: entity.companyId,
      createdAt: entity.createdAt,
    });
    return updated;
  }

  protected getId(entity: Schedule): string {
    return entity.id;
  }
}
