
import Stripe from "stripe";
import { Company } from "../../modules/companies/entities/company.entity";
import { BillingClient } from "./billing-client.interface";

export class StripeBillingClient implements BillingClient {
  private stripe: Stripe;
  private readonly successUrl: string;
  private readonly cancelUrl: string;
  private readonly proPlanPriceId: string;
  private readonly webhookSecret: string;

  constructor() {
    const apiKey = process.env.BILLING_API_KEY
    const webhookSecret = process.env.BILLING_WEBHOOK_SECRET
    const proPlanPriceId = process.env.BILLING_PRO_PLAN_PRICE_ID
    const successUrl = process.env.BILLING_SUCCESS_URL || "http://localhost:3000/success";
    const cancelUrl = process.env.BILLING_CANCEL_URL || "http://localhost:3000/cancel";

    if (!apiKey || !proPlanPriceId || !webhookSecret) {
      throw new Error("BILLING_API_KEY, BILLING_PRO_PLAN_PRICE_ID, or BILLING_WEBHOOK_SECRET is not defined in environment variables");
    }

    this.stripe = new Stripe(apiKey, { apiVersion: "2025-12-15.clover" });
    this.successUrl = successUrl;
    this.cancelUrl = cancelUrl;
    this.proPlanPriceId = proPlanPriceId;
    this.webhookSecret = webhookSecret;
  }

  async createCustomer(company: Company): Promise<{ customerId: string }> {
    const customer = await this.stripe.customers.create({
      name: company.name,
      metadata: {
        companyId: company.id,
      },
    });

    return {
      customerId: customer.id,
    };
  }

  async createCheckout(company: Company, subscriptionId: string): Promise<{ checkoutUrl: string; subscriptionId: string }> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: this.proPlanPriceId,
        quantity: 1,
      }],
      metadata: {
        companyId: company.id,
        subscriptionId: subscriptionId
      },
      subscription_data: {
        metadata: {
          companyId: company.id,
          subscriptionId: subscriptionId
        }
      },
      success_url: `${this.successUrl + '?session_id={CHECKOUT_SESSION_ID}'}`,
      cancel_url: this.cancelUrl,
      customer: company.paymentGatewayCustomerId,
    });

    if (!session || !session.url) {
      throw new Error("Failed to create Stripe Checkout session");
    }

    return {
      checkoutUrl: session.url,
      subscriptionId,
    };
  }

  async handleWebhook<T>(payload: any, sig: string): Promise<T> {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      sig,
      this.webhookSecret
    );

    return event as T;
  }
}