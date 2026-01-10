import { Logger, LoggerFactory } from '../../../shared/logger';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository.interface';

export interface WebhookPayload {
  customerId: string;
  subscriptionId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'FAILED';
  gatewaySubscriptionId?: string;
}

export interface HandleWebhookRequest {
  payload: WebhookPayload;
}

export interface HandleWebhookResponse {
  success: boolean;
  message: string;
}

export class HandleWebhookUseCase implements UseCase<HandleWebhookRequest, HandleWebhookResponse> {
  private logger: Logger;

  constructor(private subscriptionsRepository: SubscriptionsRepository) {
    this.logger = LoggerFactory.createLogger({
      module: 'Billing',
      action: 'HandleWebhook',
    });
  }

  async execute(request: HandleWebhookRequest): Promise<HandleWebhookResponse> {
    const { payload } = request;

    this.logger.info('Processing Stripe webhook', {
      customerId: payload.customerId,
      subscriptionId: payload.subscriptionId,
      status: payload.status,
    });

    try {
      const subscription = await this.subscriptionsRepository.findById(payload.subscriptionId);

      if (!subscription) {
        this.logger.warn('Subscription not found in webhook', { subscriptionId: payload.subscriptionId });
        return {
          success: false,
          message: 'Subscription not found',
        };
      }

      const newStatus = payload.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';

      this.logger.info('Updating subscription status', {
        subscriptionId: subscription.id,
        oldStatus: subscription.status,
        newStatus,
      });

      await this.subscriptionsRepository.update(subscription.id, {
        status: newStatus as 'ACTIVE' | 'INACTIVE',
        paymentGatewaySubscriptionId: payload.gatewaySubscriptionId,
      });

      this.logger.success('Webhook processed successfully', {
        subscriptionId: subscription.id,
        status: newStatus,
      });

      return {
        success: true,
        message: `Subscription updated to ${newStatus}`,
      };
    } catch (error) {
      this.logger.error('Error processing webhook', error, { subscriptionId: payload.subscriptionId });
      throw error;
    }
  }
}
