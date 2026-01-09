import { Request, Response } from 'express';
import { HandleWebhookUseCase } from '../usecases/handle-webhook.usecase';

export class WebhookController {
  constructor(private handleWebhookUseCase: HandleWebhookUseCase) { }

  async handle(req: Request, res: Response): Promise<void> {
    const { customerId, subscriptionId, status } = req.body;

    // TODO: Verify webhook signature with AbacatePay secret
    // For now, basic validation
    if (!customerId || !subscriptionId || !status) {
      res.status(400).json({ error: 'Missing required webhook fields' });
      return;
    }

    try {
      const result = await this.handleWebhookUseCase.execute({
        payload: {
          customerId,
          subscriptionId,
          status,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  }
}
