import { PlanType } from '../../../shared/billing/plan-type.enum';
import { SubscriptionStatus } from '../../../shared/billing/subscription-status.enum';
import { Logger, LoggerFactory } from '../../../shared/logger';
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
  private logger: Logger;

  constructor(private subscriptionsRepository: SubscriptionsRepository) {
    this.logger = LoggerFactory.createLogger({
      module: 'Billing',
      action: 'GetSubscriptionStatus',
    });
  }

  async execute(request: GetSubscriptionStatusRequest): Promise<GetSubscriptionStatusResponse> {
    this.logger.info('Fetching subscription status', { companyId: request.companyId });

    try {
      const subscription = await this.subscriptionsRepository.findByCompanyId(request.companyId);

      if (!subscription) {
        this.logger.info('No subscription found, returning FREE plan', { companyId: request.companyId });
        return {
          id: '',
          companyId: request.companyId,
          plan: PlanType.FREE,
          status: SubscriptionStatus.ACTIVE,
          createdAt: new Date(),
        };
      }

      this.logger.info('Subscription found', {
        subscriptionId: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
      });

      if (subscription.plan === PlanType.PRO && subscription.status !== SubscriptionStatus.ACTIVE) {
        this.logger.warn('Subscription is not active', {
          subscriptionId: subscription.id,
          status: subscription.status,
        });
        return {
          id: '',
          companyId: subscription.companyId,
          plan: PlanType.FREE,
          status: SubscriptionStatus.ACTIVE,
          createdAt: subscription.createdAt,
        };
      }

      return {
        id: subscription.id,
        companyId: subscription.companyId,
        plan: subscription.plan as PlanType,
        status: subscription.status as SubscriptionStatus,
        createdAt: subscription.createdAt,
      };
    } catch (error) {
      this.logger.error('Error fetching subscription status', error, { companyId: request.companyId });
      throw error;
    }
  }
}
