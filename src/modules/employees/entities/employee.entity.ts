import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';

export interface EmployeeProps extends BaseEntityProps {
  name: string;
  role: string;
  phone: string;
  active: boolean;
  workStartTime: string; // HH:mm format
  workEndTime: string;   // HH:mm format
  workDays: number[];    // 0-6 (Sunday to Saturday)
  companyId: string;
}

export class Employee extends BaseEntity {
  name: string;
  role: string;
  phone: string;
  active: boolean;
  workStartTime: string; // HH:mm format
  workEndTime: string;   // HH:mm format
  workDays: number[];    // 0-6 (Sunday to Saturday)
  companyId: string;

  private constructor(
    name: string,
    role: string,
    phone: string,
    active: boolean,
    workStartTime: string,
    workEndTime: string,
    workDays: number[],
    companyId: string,
    id?: string,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.name = name;
    this.role = role;
    this.phone = phone;
    this.active = active;
    this.workStartTime = workStartTime;
    this.workEndTime = workEndTime;
    this.workDays = workDays;
    this.companyId = companyId;
  }

  static create(props: EmployeeProps): Employee {
    return new Employee(
      props.name,
      props.role,
      props.phone,
      props.active,
      props.workStartTime,
      props.workEndTime,
      props.workDays,
      props.companyId,
      props.id,
      props.createdAt
    );
  }
}
