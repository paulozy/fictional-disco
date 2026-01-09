import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';

export type UserRole = 'admin' | 'manager';

export interface UserProps extends BaseEntityProps {
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
}

export class User extends BaseEntity {
  email: string;
  password: string;
  role: UserRole;
  companyId: string;

  private constructor(
    email: string,
    password: string,
    role: UserRole,
    companyId: string,
    id?: string,
    createdAt: Date = new Date()
  ) {
    super(id, createdAt);
    this.email = email;
    this.password = password;
    this.role = role;
    this.companyId = companyId;
  }

  static create(props: UserProps): User {
    return new User(
      props.email,
      props.password,
      props.role,
      props.companyId,
      props.id,
      props.createdAt
    );
  }
}
