import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';

export interface CompanyProps extends BaseEntityProps {
  name: string;
  segment: string;
}

export class Company extends BaseEntity {
  name: string;
  segment: string;

  private constructor(id: string, name: string, segment: string, createdAt: Date = new Date()) {
    super(id, createdAt);
    this.name = name;
    this.segment = segment;
  }

  static create(props: CompanyProps): Company {
    return new Company(props.id, props.name, props.segment, props.createdAt);
  }
}
