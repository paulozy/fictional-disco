import { Request, Response } from 'express';
import { CreateCheckoutUseCase } from '../usecases/create-checkout.usecase';

export class CreateCheckoutController {
  constructor(private createCheckoutUseCase: CreateCheckoutUseCase) { }

  async handle(req: Request, res: Response): Promise<void> {
    const { plan } = req.body;
    const { companyId } = req.user!;

    if (!plan || plan !== 'PRO') {
      res.status(400).json({ error: 'Invalid or missing plan' });
      return;
    }

    try {
      const result = await this.createCheckoutUseCase.execute({
        companyId,
        plan,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create checkout' });
    }
  }
}
