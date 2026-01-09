import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';
import { Shift } from '../../shifts/entities/shift.entity';

export interface ScheduleProps extends BaseEntityProps {
  weekStart: Date;
  companyId: string;
  shifts?: Shift[];
}

export class Schedule extends BaseEntity {
  weekStart: Date;
  companyId: string;
  shifts?: Shift[];

  private constructor(
    weekStart: Date,
    companyId: string,
    id?: string,
    createdAt: Date = new Date(),
    shifts?: Shift[]
  ) {
    super(id, createdAt);
    this.weekStart = weekStart;
    this.companyId = companyId;
    this.shifts = shifts;
  }

  static create(props: ScheduleProps): Schedule {
    return new Schedule(
      props.weekStart,
      props.companyId,
      props.id,
      props.createdAt,
      props.shifts
    );
  }
}
