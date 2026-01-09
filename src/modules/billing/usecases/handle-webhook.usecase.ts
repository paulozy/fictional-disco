import { UseCase } from '../../../shared/usecases/base-use-case';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository.interface';

export interface WebhookPayload {
  customerId: string;
  subscriptionId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'FAILED';
}

export interface HandleWebhookRequest {
  payload: WebhookPayload;
}

export interface HandleWebhookResponse {
  success: boolean;
  message: string;
}

export class HandleWebhookUseCase implements UseCase<HandleWebhookRequest, HandleWebhookResponse> {
  constructor(private subscriptionsRepository: SubscriptionsRepository) { }

  async execute(request: HandleWebhookRequest): Promise<HandleWebhookResponse> {
    const { payload } = request;

    const subscription = await this.subscriptionsRepository.findByPaymentGatewayCustomerId(
      payload.customerId
    );

    if (!subscription) {
      return {
        success: false,
        message: 'Subscription not found',
      };
    }

    const newStatus = payload.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';

    await this.subscriptionsRepository.update(subscription.id, {
      status: newStatus as 'ACTIVE' | 'INACTIVE',
      paymentGatewaySubscriptionId: payload.subscriptionId,
    });

    return {
      success: true,
      message: `Subscription updated to ${newStatus}`,
    };
  }
}
