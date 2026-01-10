import { BillingClient } from '../../../infra/billing/billing-client.interface';
import { Logger, LoggerFactory } from '../../../shared/logger';
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
  private logger: Logger;

  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly companiesRepository: CompaniesRepository,
    private readonly billingClient: BillingClient,
  ) {
    this.logger = LoggerFactory.createLogger({
      module: 'Billing',
      action: 'CreateCheckout',
    });
  }

  async execute(request: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    this.logger.info('Starting checkout creation', { companyId: request.companyId, plan: request.plan });

    try {
      const existingSubscription = await this.subscriptionsRepository.findByCompanyId(request.companyId);

      let subscription;

      if (!existingSubscription) {
        this.logger.info('Creating new subscription');
        subscription = await this.subscriptionsRepository.create({
          companyId: request.companyId,
          plan: request.plan,
          status: 'INACTIVE',
        });
        this.logger.success('Subscription created', { subscriptionId: subscription.id });
      } else {
        this.logger.info('Using existing subscription', { subscriptionId: existingSubscription.id });
        subscription = existingSubscription;
      }

      const company = await this.companiesRepository.findById(request.companyId);

      if (!company) {
        this.logger.error('Company not found', new Error('Company not found'), { companyId: request.companyId });
        throw new Error('Company not found');
      }

      this.logger.info('Generating checkout URL');
      const checkout = await this.billingClient.createCheckout(
        company,
        subscription.id,
      );

      this.logger.success('Checkout created successfully', { checkoutUrl: checkout.checkoutUrl });
      return checkout;
    } catch (error) {
      this.logger.error('Failed to create checkout', error, { companyId: request.companyId });
      throw error;
    }
  }
}
