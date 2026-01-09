import { UseCase } from '../../../shared/usecases/base-use-case';
import { SubscriptionsRepository } from '../repositories/subscriptions-repository.interface';

export interface CreateCheckoutRequest {
  companyId: string;
  plan: 'PRO';
}

export interface CreateCheckoutResponse {
  checkoutUrl: string;
  subscriptionId: string;
}

export class CreateCheckoutUseCase implements UseCase<CreateCheckoutRequest, CreateCheckoutResponse> {
  constructor(private subscriptionsRepository: SubscriptionsRepository) { }

  async execute(request: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    const existingSubscription = await this.subscriptionsRepository.findByCompanyId(request.companyId);

    let subscription;

    if (!existingSubscription) {
      subscription = await this.subscriptionsRepository.create({
        companyId: request.companyId,
        plan: request.plan,
        status: 'INACTIVE',
      });
    } else {
      subscription = existingSubscription;
    }

    // TODO: Call AbacatePay API to generate checkout link
    // For now, we'll return a placeholder URL
    const checkoutUrl = `https://checkout.abacatepay.com/${subscription.id}`;

    return {
      checkoutUrl,
      subscriptionId: subscription.id,
    };
  }
}
