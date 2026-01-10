import { Repository } from '../../../shared/repositories/repository.interface';
import { Subscription } from '../entities/subscription.entity';

export interface CreateSubscriptionProps {
  companyId: string;
  plan: 'FREE' | 'PRO';
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE';
  paymentGatewayCustomerId?: string;
  paymentGatewaySubscriptionId?: string;
}

export interface UpdateSubscriptionProps {
  plan?: 'FREE' | 'PRO';
  status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE';
  paymentGatewayCustomerId?: string;
  paymentGatewaySubscriptionId?: string;
}

export interface SubscriptionsRepository extends Repository<Subscription, CreateSubscriptionProps, UpdateSubscriptionProps> {
  findByCompanyId(companyId: string): Promise<Subscription | null>;
  findByPaymentGatewayCustomerId(customerId: string): Promise<Subscription | null>;
}
