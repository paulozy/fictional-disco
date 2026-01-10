import { BillingClient } from '../../../infra/billing/billing-client.interface';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { CompaniesRepository } from '../../companies/repositories/companies-repository.interface';
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
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly companiesRepository: CompaniesRepository,
    private readonly billingClient: BillingClient,
  ) { }

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

    const company = await this.companiesRepository.findById(request.companyId);

    if (!company) {
      throw new Error('Company not found');
    }

    const checkout = await this.billingClient.createCheckout(
      company,
      subscription.id,
    );

    return checkout;
  }
}
