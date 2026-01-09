import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '../../../shared/repositories/prisma-repository';
import { Schedule } from '../entities/schedule.entity';
import { CreateScheduleProps, SchedulesRepository, UpdateScheduleProps } from './schedules-repository.interface';

export class SchedulesPrismaRepository
  extends PrismaRepository<Schedule, CreateScheduleProps, UpdateScheduleProps>
  implements SchedulesRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(props: CreateScheduleProps): Promise<Schedule> {
    const schedule = await this.prisma.schedule.create({
      data: {
        weekStart: props.weekStart,
        companyId: props.companyId,
      },
    });

    return this.toDomain(schedule);
  }

  async findById(id: string): Promise<Schedule | null> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
    });

    return schedule ? this.toDomain(schedule) : null;
  }

  async findByCompanyId(companyId: string): Promise<Schedule[]> {
    const schedules = await this.prisma.schedule.findMany({
      where: { companyId },
      orderBy: { weekStart: 'desc' },
    });

    return schedules.map((sched) => this.toDomain(sched));
  }

  async findByWeekStart(weekStart: Date, companyId: string): Promise<Schedule | null> {
    const schedule = await this.prisma.schedule.findFirst({
      where: {
        weekStart: {
          gte: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()),
          lt: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 1),
        },
        companyId,
      },
    });

    return schedule ? this.toDomain(schedule) : null;
  }

  async update(id: string, props: UpdateScheduleProps): Promise<Schedule> {
    const schedule = await this.prisma.schedule.update({
      where: { id },
      data: {
        weekStart: props.weekStart,
      },
    });

    return this.toDomain(schedule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.schedule.delete({
      where: { id },
    });
  }

  protected toDomain(raw: any): Schedule {
    return Schedule.create({
      id: raw.id,
      weekStart: raw.weekStart,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
    });
  }

  protected toPersistence(entity: Schedule): any {
    return {
      id: entity.id,
      weekStart: entity.weekStart,
      companyId: entity.companyId,
      createdAt: entity.createdAt,
    };
  }
}
