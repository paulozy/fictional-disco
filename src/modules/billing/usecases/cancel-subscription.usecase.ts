import { BillingClient } from '../../../infra/billing/billing-client.interface';
import { SubscriptionStatus } from '../../../shared/billing/subscription-status.enum';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository.interface';

export interface CancelSubscriptionRequest {
  companyId: string;
}

export interface CancelSubscriptionResponse {
  id: string;
  companyId: string;
  status: 'CANCELLED';
  message: string;
}

export class CancelSubscriptionUseCase
  implements UseCase<CancelSubscriptionRequest, CancelSubscriptionResponse> {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private billingClient: BillingClient,
  ) { }

  async execute(request: CancelSubscriptionRequest): Promise<CancelSubscriptionResponse> {
    const { companyId } = request;
    const subscription = await this.subscriptionsRepository.findByCompanyId(companyId);

    if (!subscription) {
      throw new Error('Subscription not found for this company');
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new Error('Subscription is already cancelled');
    }

    if (subscription.paymentGatewaySubscriptionId) {
      try {
        await this.billingClient.cancelSubscription(subscription.paymentGatewaySubscriptionId);
      } catch (error) {
        console.error('Error cancelling subscription on payment gateway:', error);
        throw new Error('Failed to cancel subscription on payment gateway');
      }
    }

    const updatedSubscription = await this.subscriptionsRepository.update(subscription.id, {
      status: SubscriptionStatus.CANCELLED,
    });

    return {
      id: updatedSubscription.id,
      companyId: updatedSubscription.companyId,
      status: SubscriptionStatus.CANCELLED,
      message: 'Subscription cancelled successfully',
    };
  }
}
