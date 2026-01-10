import { BillingClient } from '../../../infra/billing/billing-client.interface';
import { SubscriptionStatus } from '../../../shared/billing/subscription-status.enum';
import { Logger, LoggerFactory } from '../../../shared/logger';
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
  private logger: Logger;

  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private billingClient: BillingClient,
  ) {
    this.logger = LoggerFactory.createLogger({
      module: 'Billing',
      action: 'CancelSubscription',
    });
  }

  async execute(request: CancelSubscriptionRequest): Promise<CancelSubscriptionResponse> {
    this.logger.info('Starting subscription cancellation', { companyId: request.companyId });

    try {
      const { companyId } = request;
      const subscription = await this.subscriptionsRepository.findByCompanyId(companyId);

      if (!subscription) {
        this.logger.warn('Subscription not found', { companyId });
        throw new Error('Subscription not found for this company');
      }

      if (subscription.status === SubscriptionStatus.CANCELLED) {
        this.logger.warn('Subscription already cancelled', { subscriptionId: subscription.id });
        throw new Error('Subscription is already cancelled');
      }

      if (subscription.paymentGatewaySubscriptionId) {
        try {
          this.logger.info('Cancelling subscription on payment gateway', {
            paymentGatewaySubscriptionId: subscription.paymentGatewaySubscriptionId,
          });
          await this.billingClient.cancelSubscription(subscription.paymentGatewaySubscriptionId);
          this.logger.success('Payment gateway subscription cancelled', {
            paymentGatewaySubscriptionId: subscription.paymentGatewaySubscriptionId,
          });
        } catch (error) {
          this.logger.error('Error cancelling subscription on payment gateway', error, {
            subscriptionId: subscription.id,
          });
          throw new Error('Failed to cancel subscription on payment gateway');
        }
      }

      const updatedSubscription = await this.subscriptionsRepository.update(subscription.id, {
        status: SubscriptionStatus.CANCELLED,
      });

      this.logger.success('Subscription cancelled successfully', {
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
      });

      return {
        id: updatedSubscription.id,
        companyId: updatedSubscription.companyId,
        status: SubscriptionStatus.CANCELLED,
        message: 'Subscription cancelled successfully',
      };
    } catch (error) {
      this.logger.error('Failed to cancel subscription', error, { companyId: request.companyId });
      throw error;
    }
  }
}
