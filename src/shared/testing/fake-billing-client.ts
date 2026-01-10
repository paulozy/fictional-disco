import { BillingClient } from '../../infra/billing/billing-client.interface';
import { Company } from '../../modules/companies/entities/company.entity';

export class FakeBillingClient implements BillingClient {
  async createCustomer(company: Company): Promise<{ customerId: string }> {
    return {
      customerId: `cus_fake_${company.id}`,
    };
  }

  async createCheckout(company: Company, subscriptionId: string): Promise<{ checkoutUrl: string; subscriptionId: string }> {
    return {
      checkoutUrl: `https://checkout.fake/${company.id}`,
      subscriptionId: subscriptionId,
    };
  }

  async handleWebhook(payload: any): Promise<void> {
    // Fake implementation
  }
}
