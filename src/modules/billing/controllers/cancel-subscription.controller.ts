import { Request, Response } from 'express';
import { CancelSubscriptionUseCase } from '../usecases/cancel-subscription.usecase';

export class CancelSubscriptionController {
  constructor(private cancelSubscriptionUseCase: CancelSubscriptionUseCase) { }

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { companyId } = req.user!;

      if (!companyId) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Company not found in authentication token',
        });
        return;
      }

      const response = await this.cancelSubscriptionUseCase.execute({
        companyId,
      });

      res.status(200).json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel subscription';

      res.status(400).json({
        error: 'CANCEL_SUBSCRIPTION_FAILED',
        message,
      });
    }
  }
}
