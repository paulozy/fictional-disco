import { FakeBillingClient } from '../../../shared/testing/fake-billing-client';
import { InMemoryCompaniesRepository } from '../../companies/repositories/in-memory-companies.repository';
import { InMemorySubscriptionsRepository } from '../repositories/in-memory-subscriptions.repository';
import { CreateCheckoutUseCase } from '../usecases/create-checkout.usecase';
import { GetSubscriptionStatusUseCase } from '../usecases/get-subscription-status.usecase';
import { HandleWebhookUseCase } from '../usecases/handle-webhook.usecase';

describe('Billing Usecases', () => {
  let subscriptionsRepository: InMemorySubscriptionsRepository;
  let companiesRepository: InMemoryCompaniesRepository;
  let billingClient: FakeBillingClient;
  let createCheckoutUseCase: CreateCheckoutUseCase;
  let handleWebhookUseCase: HandleWebhookUseCase;
  let getSubscriptionStatusUseCase: GetSubscriptionStatusUseCase;
  let testCompanyId: string;

  beforeEach(async () => {
    subscriptionsRepository = new InMemorySubscriptionsRepository();
    companiesRepository = new InMemoryCompaniesRepository();
    billingClient = new FakeBillingClient();

    // Create a test company for the CreateCheckoutUseCase tests
    const company = await companiesRepository.create({
      name: 'Test Company',
      segment: 'TECHNOLOGY',
      paymentGatewayCustomerId: 'stripe_customer_123',
    });
    testCompanyId = company.id;

    createCheckoutUseCase = new CreateCheckoutUseCase(
      subscriptionsRepository,
      companiesRepository,
      billingClient
    );
    handleWebhookUseCase = new HandleWebhookUseCase(subscriptionsRepository);
    getSubscriptionStatusUseCase = new GetSubscriptionStatusUseCase(subscriptionsRepository);
  });

  describe('CreateCheckoutUseCase', () => {
    it('should create a checkout for a new subscription', async () => {
      const response = await createCheckoutUseCase.execute({
        companyId: testCompanyId,
        plan: 'PRO',
      });

      expect(response).toHaveProperty('checkoutUrl');
      expect(response).toHaveProperty('subscriptionId');
      expect(response.checkoutUrl).toContain('https://');
    });

    it('should return existing subscription if already created', async () => {
      const response1 = await createCheckoutUseCase.execute({
        companyId: testCompanyId,
        plan: 'PRO',
      });

      const response2 = await createCheckoutUseCase.execute({
        companyId: testCompanyId,
        plan: 'PRO',
      });

      expect(response1.subscriptionId).toBe(response2.subscriptionId);
    });
  });

  describe('HandleWebhookUseCase', () => {
    it('should update subscription status on webhook', async () => {
      // Create a subscription first
      const checkoutResponse = await createCheckoutUseCase.execute({
        companyId: testCompanyId,
        plan: 'PRO',
      });

      // Update customer ID before webhook
      const subscription = await subscriptionsRepository.findById(checkoutResponse.subscriptionId);
      if (subscription) {
        await subscriptionsRepository.update(subscription.id, {
          paymentGatewayCustomerId: 'customer-123',
        });
      }

      // Simulate webhook
      const webhookResponse = await handleWebhookUseCase.execute({
        payload: {
          customerId: 'customer-123',
          subscriptionId: checkoutResponse.subscriptionId,
          status: 'ACTIVE',
        },
      });

      expect(webhookResponse.success).toBe(true);
      expect(webhookResponse.message).toContain('ACTIVE');
    });

    it('should return error if subscription not found on webhook', async () => {
      const webhookResponse = await handleWebhookUseCase.execute({
        payload: {
          customerId: 'non-existent-customer',
          subscriptionId: 'sub-456',
          status: 'ACTIVE',
        },
      });

      expect(webhookResponse.success).toBe(false);
      expect(webhookResponse.message).toBe('Subscription not found');
    });
  });

  describe('GetSubscriptionStatusUseCase', () => {
    it('should return FREE plan for companies without subscription', async () => {
      const response = await getSubscriptionStatusUseCase.execute({
        companyId: 'company-no-subscription',
      });

      expect(response.plan).toBe('FREE');
      expect(response.status).toBe('ACTIVE');
    });

    it('should return subscription details if company has one', async () => {
      // Create checkout first
      const checkoutResponse = await createCheckoutUseCase.execute({
        companyId: testCompanyId,
        plan: 'PRO',
      });

      // Get status
      const response = await getSubscriptionStatusUseCase.execute({
        companyId: testCompanyId,
      });

      expect(response.plan).toBe('PRO');
      expect(response.status).toBe('INACTIVE'); // New subscriptions are INACTIVE
      expect(response.id).toBe(checkoutResponse.subscriptionId);
    });
  });
});
