import { BillingClient } from '../../infra/billing/billing-client.interface';
import { StripeBillingClient } from '../../infra/billing/stripe';

export class BillingClientFactory {
  private static instance: BillingClient | null = null;

  static getInstance(): BillingClient {
    if (!this.instance) {
      this.instance = new StripeBillingClient();
    }
    return this.instance;
  }

  static setInstance(instance: BillingClient): void {
    this.instance = instance;
  }

  static reset(): void {
    this.instance = null;
  }
}
