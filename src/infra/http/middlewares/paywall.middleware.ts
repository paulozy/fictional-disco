import { NextFunction, Request, Response } from 'express';
import { PLANS } from '../../../shared/billing/plan-limits.constant';
import { PlanType } from '../../../shared/billing/plan-type.enum';
import { JwtTokenGenerator } from '../../../shared/cryptography/jwt-token-generator';
import { RepositoriesFactory } from '../../../shared/factories/repositories.factory';

const jwtTokenGenerator = new JwtTokenGenerator();

export interface PaywallOptions {
  requiredFeature?: keyof typeof PLANS[PlanType.FREE];
  requiredPlan?: PlanType;
}

/**
 * Middleware to validate user subscription against plan limits.
 * Checks if the user's plan allows the requested action.
 *
 * Error responses:
 * - "FEATURE_NOT_AVAILABLE": Feature not included in user's current plan
 * - "PLAN_LIMIT_EXCEEDED": User has reached the limit for this resource
 * - "INVALID_SUBSCRIPTION": Subscription is not active or not found
 * - "UNAUTHORIZED": User not authenticated
 */
export function paywallMiddleware(options: PaywallOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Authentication required',
        });
        return;
      }

      const [, token] = authHeader.split(' ');
      const decoded = jwtTokenGenerator.verify(token) as unknown as { sub: string; companyId: string };

      if (!decoded || !decoded.companyId) {
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Invalid authentication token',
        });
        return;
      }

      const companiesRepository = RepositoriesFactory.getCompaniesRepository();
      const subscriptionsRepository = RepositoriesFactory.getSubscriptionsRepository();

      const company = await companiesRepository.findById(decoded.companyId);
      if (!company) {
        res.status(404).json({
          error: 'COMPANY_NOT_FOUND',
          message: 'Company not found',
        });
        return;
      }

      const subscription = await subscriptionsRepository.findByCompanyId(decoded.companyId);

      let currentPlan = PlanType.FREE;
      if (subscription && subscription.status === 'ACTIVE') {
        currentPlan = (subscription.plan as PlanType) || PlanType.FREE;
      }

      if (options.requiredPlan && currentPlan !== options.requiredPlan) {
        res.status(403).json({
          error: 'FEATURE_NOT_AVAILABLE',
          message: `This feature requires ${options.requiredPlan} plan. Current plan: ${currentPlan}`,
          currentPlan,
          requiredPlan: options.requiredPlan,
        });
        return;
      }

      if (options.requiredFeature) {
        const planLimits = PLANS[currentPlan];
        const feature = options.requiredFeature as keyof typeof planLimits;

        if (typeof planLimits[feature] === 'boolean' && !planLimits[feature]) {
          res.status(403).json({
            error: 'FEATURE_NOT_AVAILABLE',
            message: `Feature "${options.requiredFeature}" is not available in ${currentPlan} plan`,
            currentPlan,
            requiredPlan: PlanType.PRO,
          });
          return;
        }
      }

      (req as any).userPlan = currentPlan;
      (req as any).planLimits = PLANS[currentPlan];
      (req as any).subscription = subscription;

      next();
    } catch (error) {
      res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to validate subscription',
      });
    }
  };
}
