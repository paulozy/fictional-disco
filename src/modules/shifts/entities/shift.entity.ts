import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';

export interface EmployeeInfo {
  id: string;
  name: string;
  role: string;
}

export interface ShiftProps extends BaseEntityProps {
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  scheduleId: string;
  employeeId: string;
  employee?: EmployeeInfo;
}

export class Shift extends BaseEntity {
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  scheduleId: string;
  employeeId: string;
  employee?: EmployeeInfo;

  private constructor(
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    scheduleId: string,
    employeeId: string,
    id?: string,
    createdAt: Date = new Date(),
    employee?: EmployeeInfo
  ) {
    super(id, createdAt);
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.scheduleId = scheduleId;
    this.employeeId = employeeId;
    this.employee = employee;
  }

  static create(props: ShiftProps): Shift {
    return new Shift(
      props.dayOfWeek,
      props.startTime,
      props.endTime,
      props.scheduleId,
      props.employeeId,
      props.id,
      props.createdAt,
      props.employee
    );
  }
}
