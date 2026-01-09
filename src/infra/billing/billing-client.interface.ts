import { Company } from "../../modules/companies/entities/company.entity";

export interface BillingClient {
  createCustomer(company: Company): Promise<{ customerId: string }>;
  createCheckout(company: Company, plan: string): Promise<{ checkoutUrl: string; subscriptionId: string }>;
  handleWebhook(payload: any): Promise<void>;
}