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

export interface PaywallOptions {
  requiredFeature?: keyof typeof PLANS[PlanType.FREE];
}

/**
 * Middleware to validate user subscription against plan limits.
 * Checks if the user's plan allows the requested action.
 * 
 * NOTE: This middleware must be used AFTER the authentication middleware.
 * The authentication middleware should set req.user.companyId.
 *
 * Features validated:
 * - autoGenerateSchedule: Only available in PRO plan
 * - maxEmployees: Validates employee count against plan limits (only when requiredFeature='maxEmployees')
 *
 * Error responses:
 * - "FEATURE_NOT_AVAILABLE": Feature not included in user's current plan
 * - "PLAN_LIMIT_REACHED": User has reached the limit for this resource
 * 
 * Usage:
 * - Auto-generate schedule: paywallMiddleware({ requiredFeature: 'autoGenerateSchedule' })
 * - Create employee: paywallMiddleware({ requiredFeature: 'maxEmployees' })
 */
export function paywallMiddleware(options: PaywallOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { companyId } = req.user!;
      if (!companyId) {
        logger.warn('Paywall: Missing companyId in authenticated request');
        res.status(401).json({
          error: 'UNAUTHORIZED',
          message: 'Invalid authentication',
        });
        return;
      }

      const subscriptionsRepository = RepositoriesFactory.getSubscriptionsRepository();
      const subscription = await subscriptionsRepository.findByCompanyId(companyId);

      let currentPlan = PlanType.FREE;
      if (subscription && subscription.status === SubscriptionStatus.ACTIVE) {
        currentPlan = (subscription.plan as PlanType) || PlanType.FREE;
      }

      const planLimits = PLANS[currentPlan];

      logger.info('Paywall validation initiated', {
        companyId,
        currentPlan,
        requiredFeature: options.requiredFeature,
      });

      // Validate required feature
      if (options.requiredFeature) {
        const featureValue = planLimits[options.requiredFeature];

        // Handle boolean features (autoGenerateSchedule)
        if (typeof featureValue === 'boolean' && featureValue === false) {
          logger.warn('Paywall: Feature not available in plan', {
            companyId,
            feature: options.requiredFeature,
            plan: currentPlan,
          });
          res.status(403).json({
            error: 'FEATURE_NOT_AVAILABLE',
            message: `The "${options.requiredFeature}" feature is not available in ${currentPlan} plan. Please upgrade to access this feature.`,
          });
          return;
        }

        // Handle numeric limit features (maxEmployees)
        if (options.requiredFeature === 'maxEmployees' && typeof featureValue === 'number') {
          const companyRepository = RepositoriesFactory.getCompaniesRepository();
          const companyEmployeesCount = await companyRepository.findCompanyEmployeesCount(companyId);

          if (companyEmployeesCount.count >= featureValue) {
            logger.warn('Paywall: Employee limit reached for current plan', {
              companyId,
              currentPlan,
              maxEmployees: featureValue,
              currentCount: companyEmployeesCount.count,
            });
            res.status(403).json({
              error: 'PLAN_LIMIT_REACHED',
              message: `You have reached the maximum number of employees (${featureValue}) allowed in your current plan. Please upgrade to add more employees.`,
            });
            return;
          }
        }
      }

      logger.info('Paywall validation passed', {
        companyId,
        plan: currentPlan,
        feature: options.requiredFeature,
      });

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
