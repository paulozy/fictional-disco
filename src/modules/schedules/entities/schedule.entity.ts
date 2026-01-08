import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';

export interface ScheduleProps extends BaseEntityProps {
  weekStart: Date;
  companyId: string;
}

export class Schedule extends BaseEntity {
  weekStart: Date;
  companyId: string;

  private constructor(
    id: string,
    weekStart: Date,
    companyId: string,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.weekStart = weekStart;
    this.companyId = companyId;
  }

  static create(props: ScheduleProps): Schedule {
    return new Schedule(
      props.id,
      props.weekStart,
      props.companyId,
      props.createdAt
    );
  }
}
