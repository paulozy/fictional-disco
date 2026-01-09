import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';

export interface CompanyProps extends BaseEntityProps {
  name: string;
  segment: string;
  paymentGatewayCustomerId?: string;
}

export class Company extends BaseEntity {
  name: string;
  segment: string;
  paymentGatewayCustomerId?: string;

  private constructor(
    name: string,
    segment: string,
    id?: string,
    createdAt: Date = new Date(),
    paymentGatewayCustomerId?: string
  ) {
    super(id, createdAt);
    this.name = name;
    this.segment = segment;
    this.paymentGatewayCustomerId = paymentGatewayCustomerId;
  }

  static create(props: CompanyProps): Company {
    return new Company(
      props.name,
      props.segment,
      props.id,
      props.createdAt,
      props.paymentGatewayCustomerId
    );
  }
}
