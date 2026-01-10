import { NextFunction, Request, Response } from 'express';
import { PLANS } from '../../../shared/billing/plan-limits.constant';
import { PlanType } from '../../../shared/billing/plan-type.enum';
import { SubscriptionStatus } from '../../../shared/billing/subscription-status.enum';
import { RepositoriesFactory } from '../../../shared/factories/repositories.factory';
import { LoggerFactory } from '../../../shared/logger';

const logger = LoggerFactory.createLogger({
  module: 'Paywall',
  action: 'Validation',
});

/**
 * Middleware to validate user subscription against plan limits.
 * Checks if the user's plan allows the requested action.
 * 
 * NOTE: This middleware must be used AFTER the authentication middleware.
 * The authentication middleware should set req.user.companyId.
 *
 * Features validated:
 * - autoGenerateSchedule: Only available in PRO plan
 *
 * Error responses:
 * - "FEATURE_NOT_AVAILABLE": Feature not included in user's current plan
 */
export function paywallMiddleware(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.user!
      if (!companyId) {
        logger.warn('Paywall: Missing companyId in authenticated request');
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Invalid authentication',
        });
        return;
      }

      const companyRepository = RepositoriesFactory.getCompaniesRepository();
      const companyEmployeesCount = await companyRepository.findCompanyEmployeesCount(companyId);

      const subscriptionsRepository = RepositoriesFactory.getSubscriptionsRepository();
      const subscription = await subscriptionsRepository.findByCompanyId(companyId);

      let currentPlan = PlanType.FREE;
      if (subscription && subscription.status === SubscriptionStatus.ACTIVE) {
        currentPlan = (subscription.plan as PlanType) || PlanType.FREE;
      }

      const planLimits = PLANS[currentPlan];

      if (req.path.includes('/schedules/auto-generate')) {
        if (!planLimits.autoGenerateSchedule) {
          logger.info('Paywall: Feature not available in current plan', {
            companyId,
            currentPlan,
            feature: 'autoGenerateSchedule',
          });
          res.status(403).json({
            error: 'FEATURE_NOT_AVAILABLE',
            message: 'Auto-generate schedule feature is not available in your current plan. Please upgrade to access this feature.',
          });
          return;
        }
      }

      if (planLimits.maxEmployees !== 'unlimited') {
        if (companyEmployeesCount.count >= planLimits.maxEmployees) {
          logger.info('Paywall: Employee limit reached for current plan', {
            companyId,
            currentPlan,
            maxEmployees: planLimits.maxEmployees,
          });
          res.status(403).json({
            error: 'PLAN_LIMIT_REACHED',
            message: `You have reached the maximum number of employees (${planLimits.maxEmployees}) allowed in your current plan. Please upgrade to add more employees.`,
          });
          return;
        }
      }

      logger.info('Paywall: Access granted', { companyId, currentPlan, endpoint: req.path });

      next();
    } catch (error) {
      logger.error('Paywall validation error', error, {
        endpoint: req.path,
      });
      res.status(500).json({
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to validate subscription',
      });
    }
  };
}

/**
 * Utility function to check if a user can perform an action based on their plan
 */
export function canAccessFeature(
  userPlan: PlanType,
  feature: keyof typeof PLANS[PlanType.FREE]
): boolean {
  const planLimits = PLANS[userPlan];
  const featureValue = planLimits[feature];

  if (typeof featureValue === 'boolean') {
    return featureValue;
  }

  return true;
}

/**
 * Utility function to check if user has reached a limit
 */
export function hasReachedLimit(
  userPlan: PlanType,
  feature: keyof typeof PLANS[PlanType.FREE],
  currentCount: number
): boolean {
  const planLimits = PLANS[userPlan];
  const limit = planLimits[feature];

  if (limit === 'unlimited') {
    return false;
  }

  if (typeof limit === 'number') {
    return currentCount >= limit;
  }

  return false;
}
