import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '../../../shared/repositories/prisma-repository';
import { Shift } from '../entities/shift.entity';
import { CreateShiftProps, ShiftsRepository, UpdateShiftProps } from './shifts-repository.interface';

export class ShiftsPrismaRepository
  extends PrismaRepository<Shift, CreateShiftProps, UpdateShiftProps>
  implements ShiftsRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(props: CreateShiftProps): Promise<Shift> {
    const shift = await this.prisma.shift.create({
      data: {
        dayOfWeek: props.dayOfWeek,
        startTime: props.startTime,
        endTime: props.endTime,
        scheduleId: props.scheduleId,
        employeeId: props.employeeId,
      },
    });

    return this.toDomain(shift);
  }

  async findById(id: string): Promise<Shift | null> {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
    });

    return shift ? this.toDomain(shift) : null;
  }

  async findByScheduleId(scheduleId: string): Promise<Shift[]> {
    const shifts = await this.prisma.shift.findMany({
      where: { scheduleId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return shifts.map((shift) => this.toDomain(shift));
  }

  async findByEmployeeIdAndScheduleId(employeeId: string, scheduleId: string): Promise<Shift[]> {
    const shifts = await this.prisma.shift.findMany({
      where: { employeeId, scheduleId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return shifts.map((shift) => this.toDomain(shift));
  }

  async findByScheduleIdAndDayOfWeek(scheduleId: string, dayOfWeek: number): Promise<Shift[]> {
    const shifts = await this.prisma.shift.findMany({
      where: { scheduleId, dayOfWeek },
    });

    return shifts.map((shift) => this.toDomain(shift));
  }

  async deleteByScheduleId(scheduleId: string): Promise<void> {
    await this.prisma.shift.deleteMany({
      where: { scheduleId },
    });
  }

  async update(id: string, props: UpdateShiftProps): Promise<Shift> {
    const shift = await this.prisma.shift.update({
      where: { id },
      data: {
        dayOfWeek: props.dayOfWeek,
        startTime: props.startTime,
        endTime: props.endTime,
      },
    });

    return this.toDomain(shift);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shift.delete({
      where: { id },
    });
  }

  protected toDomain(raw: any): Shift {
    return Shift.create({
      id: raw.id,
      dayOfWeek: raw.dayOfWeek,
      startTime: raw.startTime,
      endTime: raw.endTime,
      scheduleId: raw.scheduleId,
      employeeId: raw.employeeId,
      createdAt: raw.createdAt,
    });
  }

  protected toPersistence(entity: Shift): any {
    return {
      id: entity.id,
      dayOfWeek: entity.dayOfWeek,
      startTime: entity.startTime,
      endTime: entity.endTime,
      scheduleId: entity.scheduleId,
      employeeId: entity.employeeId,
      createdAt: entity.createdAt,
    };
  }
}
