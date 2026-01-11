import { Request, Response } from 'express';
import Stripe from 'stripe';
import { convertStripeEventTypeToStatus } from '../../../shared/billing/convert-stripe-event-type-to-status';
import { BillingClientFactory } from '../../../shared/factories/billing-client.factory';
import { HandleWebhookUseCase } from '../usecases/handle-webhook.usecase';

export class WebhookController {
  constructor(private handleWebhookUseCase: HandleWebhookUseCase) { }

  async handle(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const billingClient = BillingClientFactory.getInstance();
      const event = await billingClient.handleWebhook<Stripe.Event>(req.body, sig);

      const status = convertStripeEventTypeToStatus(event.type);
      const customerId = (event.data.object as any)['customer'];
      const { subscriptionId } = (event.data.object as any)['metadata'];
      const gatewaySubscriptionId = (event.data.object as any)['id'];

      const result = await this.handleWebhookUseCase.execute({
        payload: {
          customerId,
          subscriptionId,
          status,
          gatewaySubscriptionId,
        },
      });

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.status(200).json({ result });
    } catch (error) {
      console.log("🚀 ~ WebhookController ~ handle ~ error:", error)
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  }
}