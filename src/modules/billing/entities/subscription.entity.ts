import { BaseEntity, BaseEntityProps } from '../../../shared/entities/base-entity.entity';

export type PlanType = 'FREE' | 'PRO';
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE';

export interface SubscriptionProps extends BaseEntityProps {
  companyId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  paymentGatewayCustomerId?: string;
  paymentGatewaySubscriptionId?: string;
}

export class Subscription extends BaseEntity {
  companyId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  paymentGatewayCustomerId?: string;
  paymentGatewaySubscriptionId?: string;

  private constructor(
    companyId: string,
    plan: PlanType,
    status: SubscriptionStatus,
    id?: string,
    createdAt: Date = new Date(),
    paymentGatewayCustomerId?: string,
    paymentGatewaySubscriptionId?: string
  ) {
    super(id, createdAt);
    this.companyId = companyId;
    this.plan = plan;
    this.status = status;
    this.paymentGatewayCustomerId = paymentGatewayCustomerId;
    this.paymentGatewaySubscriptionId = paymentGatewaySubscriptionId;
  }

  static create(props: SubscriptionProps): Subscription {
    return new Subscription(
      props.companyId,
      props.plan,
      props.status,
      props.id,
      props.createdAt,
      props.paymentGatewayCustomerId,
      props.paymentGatewaySubscriptionId
    );
  }
}
