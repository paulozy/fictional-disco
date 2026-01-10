import { Request, Response } from 'express';
import { GetSubscriptionStatusUseCase } from '../usecases/get-subscription-status.usecase';

export class GetSubscriptionStatusController {
  constructor(private getSubscriptionStatusUseCase: GetSubscriptionStatusUseCase) { }

  async handle(req: Request, res: Response): Promise<void> {
    const { companyId } = req.user!;

    try {
      const result = await this.getSubscriptionStatusUseCase.execute({
        companyId,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  }
}
