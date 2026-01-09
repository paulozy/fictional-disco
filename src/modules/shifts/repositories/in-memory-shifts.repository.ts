import { InMemoryRepository } from '../../../shared/testing/in-memory-repository';
import { Shift } from '../entities/shift.entity';
import { CreateShiftProps, ShiftsRepository, UpdateShiftProps } from '../repositories/shifts-repository.interface';

export class InMemoryShiftsRepository
  extends InMemoryRepository<Shift, CreateShiftProps, UpdateShiftProps>
  implements ShiftsRepository {
  async findByScheduleId(scheduleId: string): Promise<Shift[]> {
    const shifts: Shift[] = [];
    for (const shift of this.entities.values()) {
      if (shift.scheduleId === scheduleId) {
        shifts.push(shift);
      }
    }
    return shifts;
  }

  async findByEmployeeIdAndScheduleId(employeeId: string, scheduleId: string): Promise<Shift[]> {
    const shifts: Shift[] = [];
    for (const shift of this.entities.values()) {
      if (shift.employeeId === employeeId && shift.scheduleId === scheduleId) {
        shifts.push(shift);
      }
    }
    return shifts;
  }

  async findByScheduleIdAndDayOfWeek(scheduleId: string, dayOfWeek: number): Promise<Shift[]> {
    const shifts: Shift[] = [];
    for (const shift of this.entities.values()) {
      if (shift.scheduleId === scheduleId && shift.dayOfWeek === dayOfWeek) {
        shifts.push(shift);
      }
    }
    return shifts;
  }

  async deleteByScheduleId(scheduleId: string): Promise<void> {
    const idsToDelete: string[] = [];
    for (const shift of this.entities.values()) {
      if (shift.scheduleId === scheduleId) {
        idsToDelete.push(shift.id);
      }
    }
    for (const id of idsToDelete) {
      this.entities.delete(id);
    }
  }

  protected createEntity(props: CreateShiftProps): Shift {
    return Shift.create({
      dayOfWeek: props.dayOfWeek,
      startTime: props.startTime,
      endTime: props.endTime,
      scheduleId: props.scheduleId,
      employeeId: props.employeeId,
    });
  }

  protected updateEntity(entity: Shift, props: UpdateShiftProps): Shift {
    const updated = Shift.create({
      id: entity.id,
      dayOfWeek: props.dayOfWeek || entity.dayOfWeek,
      startTime: props.startTime || entity.startTime,
      endTime: props.endTime || entity.endTime,
      scheduleId: entity.scheduleId,
      employeeId: entity.employeeId,
      createdAt: entity.createdAt,
    });
    return updated;
  }

  protected getId(entity: Shift): string {
    return entity.id;
  }
}
