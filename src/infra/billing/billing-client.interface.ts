import { Company } from "../../modules/companies/entities/company.entity";

export interface BillingClient {
  createCustomer(company: Company): Promise<{ customerId: string }>;
  createCheckout(company: Company, subscriptionId: string): Promise<{ checkoutUrl: string; subscriptionId: string }>;
  handleWebhook<T>(payload: any, sig: string): Promise<T>;
}