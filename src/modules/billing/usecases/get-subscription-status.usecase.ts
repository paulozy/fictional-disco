import { PlanType } from '../../../shared/billing/plan-type.enum';
import { SubscriptionStatus } from '../../../shared/billing/subscription-status.enum';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository.interface';

export interface GetSubscriptionStatusRequest {
  companyId: string;
}

export interface GetSubscriptionStatusResponse {
  id: string;
  companyId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  paymentGatewayCustomerId?: string;
  paymentGatewaySubscriptionId?: string;
  createdAt: Date;
}

export class GetSubscriptionStatusUseCase implements UseCase<GetSubscriptionStatusRequest, GetSubscriptionStatusResponse> {
  constructor(private subscriptionsRepository: SubscriptionsRepository) { }

  async execute(request: GetSubscriptionStatusRequest): Promise<GetSubscriptionStatusResponse> {
    const subscription = await this.subscriptionsRepository.findByCompanyId(request.companyId);

    if (!subscription) {
      return {
        id: '',
        companyId: request.companyId,
        plan: PlanType.FREE,
        status: SubscriptionStatus.ACTIVE,
        createdAt: new Date(),
      };
    }

    return {
      id: subscription.id,
      companyId: subscription.companyId,
      plan: subscription.plan as PlanType,
      status: subscription.status as SubscriptionStatus,
      paymentGatewayCustomerId: subscription.paymentGatewayCustomerId,
      paymentGatewaySubscriptionId: subscription.paymentGatewaySubscriptionId,
      createdAt: subscription.createdAt,
    };
  }
}
